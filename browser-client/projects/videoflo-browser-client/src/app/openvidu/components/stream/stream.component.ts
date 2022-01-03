import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChild,
  Output,
  EventEmitter,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { UserModel } from '../../models/user-model';
import { UtilsService } from '../../services/utils/utils.service';
import { LayoutType } from '../../types/layout-type';
import { VideoSizeIcon, VideoFullscreenIcon } from '../../types/icon-type';
import { MatMenuTrigger, MatMenuPanel } from '@angular/material/menu';
import { CdkOverlayService } from '../../services/cdk-overlay/cdk-overlay.service';
import { VideoType } from '../../types/video-type';

@Component({
  selector: 'stream-component',
  styleUrls: ['./stream.component.css'],
  templateUrl: './stream.component.html',
})
export class StreamComponent implements OnInit, OnDestroy {
  videoSizeIconEnum = VideoSizeIcon;
  videoFullscreenIconEnum = VideoFullscreenIcon;
  videoTypeEnum = VideoType;
  videoSizeIcon: VideoSizeIcon = VideoSizeIcon.BIG;
  fullscreenIcon: VideoFullscreenIcon = VideoFullscreenIcon.BIG;
  mutedSound: boolean;
  toggleNickname: boolean;
  isFullscreen: boolean;

  @Input() user: UserModel;
  @Output() replaceScreenTrackClicked = new EventEmitter<any>();
  @Output() toggleVideoSizeClicked = new EventEmitter<any>();

  @ViewChild('streamComponent', { read: ViewContainerRef })
  streamComponent: ViewContainerRef;
  @ViewChild(MatMenuTrigger) public menuTrigger: MatMenuTrigger;
  @ViewChild('menu') menu: MatMenuPanel;

  constructor(
    private utilsSrv: UtilsService,
    private cdkSrv: CdkOverlayService
  ) {}

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    const maxHeight = window.screen.height;
    const maxWidth = window.screen.width;
    const curHeight = window.innerHeight;
    const curWidth = window.innerWidth;
    if (maxWidth !== curWidth && maxHeight !== curHeight) {
      this.isFullscreen = false;
      this.videoSizeIcon = VideoSizeIcon.BIG;
    }
  }

  // Has been mandatory fullscreen Input because of Input user did not fire changing
  // the fullscreen user property in publisherStartSpeaking event in VideoRoom Component
  @Input()
  set videoSizeBig(videoSizeBig: boolean) {
    this.checkVideoSizeBigIcon(videoSizeBig);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.cdkSrv.setSelector('body');
  }

  toggleVideoSize(resetAll?) {
    const element = this.utilsSrv.getHTMLElementByClassName(
      this.streamComponent.element.nativeElement,
      LayoutType.ROOT_CLASS
    );
    this.toggleVideoSizeClicked.emit({
      element,
      connectionId: this.user.getConnectionId(),
      resetAll,
    });
  }

  toggleFullscreen() {
    this.utilsSrv.toggleFullscreen(
      'container-' + this.user.getStreamManager().stream.streamId
    );
    this.toggleFullscreenIcon();
  }

  toggleVideoMenu(event) {
    if (this.menuTrigger.menuOpen) {
      this.menuTrigger.closeMenu();
      return;
    }
    this.cdkSrv.setSelector(
      '#container-' + this.user.streamManager?.stream?.streamId
    );
    this.menuTrigger.openMenu();
  }

  toggleSound() {
    this.mutedSound = !this.mutedSound;
  }

  replaceScreenTrack() {
    this.replaceScreenTrackClicked.emit();
  }

  private checkVideoSizeBigIcon(videoSizeBig: boolean) {
    this.videoSizeIcon = videoSizeBig
      ? VideoSizeIcon.NORMAL
      : VideoSizeIcon.BIG;
  }

  private toggleFullscreenIcon() {
    this.fullscreenIcon =
      this.fullscreenIcon === VideoFullscreenIcon.BIG
        ? VideoFullscreenIcon.NORMAL
        : VideoFullscreenIcon.BIG;
  }
}
