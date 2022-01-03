import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivitiesService } from '../../../services/activities.service';
import { videoflo_logo_32px } from '../../../shared/images';
import { OvSettingsModel } from '../../models/ovSettings';
import { ChatService } from '../../services/chat/chat.service';
import { DevicesService } from '../../services/devices/devices.service';
import { LocalUsersService } from '../../services/local-users/local-users.service';
import { OpenViduWebrtcService } from '../../services/openvidu-webrtc/openvidu-webrtc.service';
import { UtilsService } from '../../services/utils/utils.service';
import { VideoFullscreenIcon } from '../../types/icon-type';

@Component({
  selector: 'videoflo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() lightTheme: boolean;
  @Input() compact: boolean;
  @Input() showNotification: boolean;
  @Input() ovSettings: OvSettingsModel;

  @Input() isWebcamAudioEnabled: boolean;
  @Input() isAutoLayout: boolean;
  @Input() isConnectionLost = false;
  @Input() hasVideoDevices: boolean;
  @Input() hasAudioDevices: boolean;
  @Output() micButtonClicked = new EventEmitter<any>();
  @Output() camButtonClicked = new EventEmitter<any>();
  @Output() screenShareClicked = new EventEmitter<any>();
  @Output() layoutButtonClicked = new EventEmitter<any>();
  @Output() leaveSessionButtonClicked = new EventEmitter<any>();

  @ViewChild('toolbar') toolbar: ElementRef;

  sessionId: string;
  sessionName: string;
  foundCameras: any[];
  currentlySelectedCamera: string;

  newMessagesNum: number;
  isScreenShareEnabled: boolean;
  isWebcamVideoEnabled: boolean;

  fullscreenIcon = VideoFullscreenIcon.BIG;
  logoUrl = videoflo_logo_32px;

  participantsNames: string[] = [];

  private chatServiceSubscription: Subscription;
  private screenShareStateSubscription: Subscription;
  private webcamVideoStateSubscription: Subscription;

  constructor(
    private utilsSrv: UtilsService,
    private chatService: ChatService,
    private localUsersService: LocalUsersService,
    private activitiesService: ActivitiesService,
    private deviceServices: DevicesService,
    private openviduWebrtcService: OpenViduWebrtcService
  ) {}

  ngOnDestroy(): void {
    if (this.chatServiceSubscription) {
      this.chatServiceSubscription.unsubscribe();
    }
    if (this.screenShareStateSubscription) {
      this.screenShareStateSubscription.unsubscribe();
    }
    if (this.webcamVideoStateSubscription) {
      this.webcamVideoStateSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize')
  sizeChange(): void {
    // const maxHeight = window.screen.height;
    // const maxWidth = window.screen.width;
    // const curHeight = window.innerHeight;
    // const curWidth = window.innerWidth;
    // if (maxWidth !== curWidth && maxHeight !== curHeight) {
    //   this.fullscreenIcon = VideoFullscreenIcon.BIG;
    // }

    if (!this.toolbar) {
      setTimeout(() => {
        this.sizeChange();
      }, 500);
    }

    let parent = <HTMLElement>document.querySelector('div#layout .OV_big');

    if (!parent) parent = document.getElementById('layout');

    const ele = this.toolbar.nativeElement;

    if (parent) {
      ele.style.display = 'none';

      // openvidu-layout animates the layout. So running the calculations immediately will not give
      // proper width & height of the parent "BIG" video element. So we just delay the execution
      // of the actual logic.
      setTimeout(() => {
        const height = parseInt(parent.style.height.replace('px', ''));
        ele.style.top = height - 70 + 'px';
        ele.style.left = parent.style.left;
        ele.style.width = parent.style.width;
        ele.style.display = '';
      }, 500);
    }
  }

  ngOnInit(): void {
    this.sessionId = this.activitiesService.openviduSessionId;
    this.sessionName = this.activitiesService.videofloSessionName;
    this.deviceServices
      .initDevices()
      .then((selectedCam) => {
        this.foundCameras = this.deviceServices.getCameras();
        this.currentlySelectedCamera = selectedCam.device;
      })
      .catch(() => {});

    this.chatServiceSubscription = this.chatService.messagesUnreadObs.subscribe((num) => {
      this.newMessagesNum = num;
    });

    this.screenShareStateSubscription = this.localUsersService.screenShareState.subscribe((enabled) => {
      this.isScreenShareEnabled = enabled;
    });

    this.webcamVideoStateSubscription = this.localUsersService.webcamVideoActive.subscribe((enabled) => {
      this.isWebcamVideoEnabled = enabled;
    });
  }

  ngAfterViewInit(): void {
    this.sizeChange();
  }
  toggleMicrophone(): void {
    this.micButtonClicked.emit();
  }

  toggleCamera(): void {
    this.camButtonClicked.emit();
  }

  toggleScreenShare(): void {
    this.screenShareClicked.emit();
  }

  toggleSpeakerLayout(): void {
    this.layoutButtonClicked.emit();
  }

  leaveSession(): void {
    this.leaveSessionButtonClicked.emit();
  }

  toggleChat(): void {
    this.chatService.toggleChat();
  }

  async switchCamera() {
    this.openviduWebrtcService.unpublishWebcamPublisher();
    const switchToId = this.foundCameras?.filter((val) => val.device !== this.currentlySelectedCamera)[0];
    this.currentlySelectedCamera = switchToId.device;
    this.openviduWebrtcService.replaceTrack(this.currentlySelectedCamera, null, false);
    this.openviduWebrtcService.publishWebcamPublisher();
  }
  toggleFullscreen(): void {
    this.utilsSrv.toggleFullscreen('videoRoomNavBar');
    this.fullscreenIcon = this.fullscreenIcon === VideoFullscreenIcon.BIG ? VideoFullscreenIcon.NORMAL : VideoFullscreenIcon.BIG;
  }
}
