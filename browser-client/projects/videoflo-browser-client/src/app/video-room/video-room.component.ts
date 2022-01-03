import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import {
  ConnectionEvent,
  Publisher,
  PublisherSpeakingEvent,
  Session,
  SessionDisconnectedEvent,
  StreamEvent,
  StreamPropertyChangedEvent,
  Subscriber
} from 'openvidu-browser';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChatComponent } from '../openvidu/components/chat/chat.component';
import { StreamComponent } from '../openvidu/components/stream/stream.component';
import { ExternalConfigModel } from '../openvidu/models/external-config';
import { OvSettingsModel } from '../openvidu/models/ovSettings';
import { UserModel } from '../openvidu/models/user-model';
import { ChatService } from '../openvidu/services/chat/chat.service';
import { DevicesService } from '../openvidu/services/devices/devices.service';
import { OpenViduLayoutService } from '../openvidu/services/layout/layout.service';
import { LocalUsersService } from '../openvidu/services/local-users/local-users.service';
import { LoggerService } from '../openvidu/services/logger/logger.service';
import { OpenViduWebrtcService } from '../openvidu/services/openvidu-webrtc/openvidu-webrtc.service';
import { RemoteUsersService } from '../openvidu/services/remote-users/remote-users.service';
import { StorageService } from '../openvidu/services/storage/storage.service';
import { UtilsService } from '../openvidu/services/utils/utils.service';
import { LayoutType } from '../openvidu/types/layout-type';
import { ILogger } from '../openvidu/types/logger-type';
import { UserName } from '../openvidu/types/username-type';
import { ScreenType, VideoType } from '../openvidu/types/video-type';
import { Theme } from '../openvidu/types/webcomponent-config';
import { ActivitiesService } from '../services/activities.service';
import { ActivitiesContainerComponent } from '../activities/activities-container/activities-container.component';

@Component({
  selector: 'videoflo-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.css'] //, './video-room-responsive.component.css']
})
export class VideoRoomComponent implements OnInit, OnDestroy {
  // Config from webcomponent or angular-library
  @Input() externalConfig: ExternalConfigModel;
  @Output() _session = new EventEmitter<any>();
  @Output() _publisher = new EventEmitter<any>();
  @Output() _error = new EventEmitter<any>();

  @Output() _joinSession = new EventEmitter<any>();

  @Output() _leaveSession = new EventEmitter<any>();

  @ViewChild('chatComponent') chatComponent: ChatComponent;
  @ViewChild('sidenav') chatSidenav: MatSidenav;

  @ViewChildren(StreamComponent) streams: StreamComponent[];

  @ViewChild('activitiesContainer')
  activitiesContainer: ActivitiesContainerComponent;

  ovSettings: OvSettingsModel;
  lightTheme: boolean;
  showConfigRoomCard = true;
  session: Session;
  sessionScreen: Session;
  localUsers: UserModel[] = [];
  remoteUsers: UserModel[] = [];
  participantsNameList: UserName[] = [];
  isConnectionLost = false;
  isAutoLayout = false;
  hasVideoDevices: boolean;
  hasAudioDevices: boolean;
  private log: ILogger;
  private oVUsersSubscription: Subscription;
  private remoteUsersSubscription: Subscription;
  private chatSubscription: Subscription;
  private remoteUserNameSubscription: Subscription;

  constructor(
    private utilsSrv: UtilsService,
    private remoteUsersService: RemoteUsersService,
    private openViduWebRTCService: OpenViduWebrtcService,
    private localUsersService: LocalUsersService,
    private oVDevicesService: DevicesService,
    private loggerSrv: LoggerService,
    private chatService: ChatService,
    private storageSrv: StorageService,
    private oVLayout: OpenViduLayoutService,
    private activitiesService: ActivitiesService
  ) {
    this.log = this.loggerSrv.get('VideoRoomComponent');
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler(): void {
    this.leaveSession(null);
  }

  @HostListener('window:resize')
  sizeChange(): void {
    this.adjustLayout();
    this.oVLayout.update();
  }

  ngOnInit() {
    this.localUsersService.initialize();
    this.openViduWebRTCService.initialize();

    this.lightTheme = this.externalConfig?.getTheme() === Theme.LIGHT;
    this.ovSettings = this.externalConfig ? this.externalConfig.getOvSettings() : new OvSettingsModel();
    this.ovSettings.setScreenSharing(this.ovSettings.hasScreenSharing() && !this.utilsSrv.isMobile());
  }

  ngOnDestroy(): void {
    // Reconnecting session is received in Firefox
    // To avoid 'Connection lost' message uses session.off()
    this.session?.off('reconnecting');
    this.remoteUsersService.clear();
    this.oVLayout.clear();
    this.localUsersService.clear();
    this.session = null;
    this.sessionScreen = null;
    this.localUsers = [];
    this.remoteUsers = [];
    if (this.oVUsersSubscription) {
      this.oVUsersSubscription.unsubscribe();
    }
    if (this.remoteUsersSubscription) {
      this.remoteUsersSubscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.remoteUserNameSubscription) {
      this.remoteUserNameSubscription.unsubscribe();
    }
  }

  onConfigRoomJoin(): void {
    this.hasVideoDevices = this.oVDevicesService.hasVideoDeviceAvailable();
    this.hasAudioDevices = this.oVDevicesService.hasAudioDeviceAvailable();
    this.showConfigRoomCard = false;
    this.subscribeToLocalUsers();
    this.subscribeToRemoteUsers();

    setTimeout(() => {
      this.adjustLayout();
      this.oVLayout.initialize();
      this.joinToSession();
    }, 50);
  }
  adjustLayout() {
    const videoContainer = document.getElementById('video-container');
    const layout = document.getElementById('layout');
    const sidebar = document.getElementById('side-bar');

    // If we can't find the elements yet, try again after half a second
    if (!videoContainer || !layout || !sidebar) {
      setTimeout(() => {
        this.adjustLayout();
      }, 500);
    }

    const videoContainerPercent = 0.65;

    const height = window.innerHeight;
    const width = window.innerWidth;

    if (width >= 992) {
      videoContainer.style.height = layout.style.height = sidebar.style.height = height + 'px';

      const videoContainerWidth = Math.round(width * videoContainerPercent);
      const sideBarWidth = Math.round(width * (1 - videoContainerPercent));

      videoContainer.style.width = layout.style.width = videoContainerWidth + 'px';
      videoContainer.style.position = 'absolute';
      videoContainer.style.left = '0px';
      videoContainer.style.top = '0px';

      sidebar.style.width = sideBarWidth + 'px';
      sidebar.style.position = 'absolute';
      sidebar.style.left = videoContainerWidth + 'px';
      sidebar.style.top = '0px';
    } else {
      videoContainer.style.width = layout.style.width = sidebar.style.width = width + 'px';

      const videoContainerHeight = Math.round(height * videoContainerPercent);
      const sideBarHeight = Math.round(height * (1 - videoContainerPercent));

      videoContainer.style.position = null;
      videoContainer.style.height = layout.style.height = videoContainerHeight + 'px';

      sidebar.style.position = null;
      sidebar.style.height = sideBarHeight + 'px';
    }
  }

  async joinToSession(): Promise<void> {
    this.openViduWebRTCService.initSessions();
    this.session = this.openViduWebRTCService.getWebcamSession();
    this._session.emit(this.session);
    this.sessionScreen = this.openViduWebRTCService.getScreenSession();
    this.subscribeToConnectionCreatedAndDestroyed();
    this.subscribeToStreamCreated();
    this.subscribeToStreamDestroyed();
    this.subscribeToStreamPropertyChange();
    this.subscribeToNicknameChanged();
    this.chatService.setChatComponent(this.chatSidenav);
    this.chatService.subscribeToChat();
    this.subscribeToChatComponent();
    this.subscribeToReconnection();
    await this.connectToSession();

    // await this.activitiesContainer.start();

    // Workaround, firefox does not have audio when publisher join with muted camera
    if (this.utilsSrv.isFirefox() && !this.localUsersService.hasWebcamVideoActive()) {
      this.openViduWebRTCService.publishWebcamVideo(true);
      this.openViduWebRTCService.publishWebcamVideo(false);
    }
  }

  leaveSession(workflowResultState: any): void {
    this.log.d('Leaving session...');
    this.openViduWebRTCService.disconnect();
    this._leaveSession.emit(workflowResultState);
  }

  toggleMic(): void {
    if (this.localUsersService.isWebCamEnabled()) {
      this.openViduWebRTCService.publishWebcamAudio(!this.localUsersService.hasWebcamAudioActive());
      return;
    }
    this.openViduWebRTCService.publishScreenAudio(!this.localUsersService.hasScreenAudioActive());
  }

  async toggleCam(): Promise<void> {
    const publishVideo = !this.localUsersService.hasWebcamVideoActive();

    // Disabling webcam
    if (this.localUsersService.areBothConnected()) {
      this.openViduWebRTCService.publishWebcamVideo(publishVideo);
      this.localUsersService.disableWebcamUser();
      this.openViduWebRTCService.unpublishWebcamPublisher();
      return;
    }
    // Enabling webcam
    if (this.localUsersService.isOnlyScreenConnected()) {
      const hasAudio = this.localUsersService.hasScreenAudioActive();

      if (!this.openViduWebRTCService.isWebcamSessionConnected()) {
        await this.connectWebcamSession();
      }
      await this.openViduWebRTCService.publishWebcamPublisher();
      this.openViduWebRTCService.publishScreenAudio(false);
      this.openViduWebRTCService.publishWebcamAudio(hasAudio);
      this.localUsersService.enableWebcamUser();
    }
    // Muting/unmuting webcam
    this.openViduWebRTCService.publishWebcamVideo(publishVideo);
  }

  async toggleScreenShare(): Promise<void> {
    // Disabling screenShare
    if (this.localUsersService.areBothConnected()) {
      this.removeScreen();
      return;
    }

    // Enabling screenShare
    if (this.localUsersService.isOnlyWebcamConnected()) {
      const screenPublisher = this.initScreenPublisher();

      screenPublisher.once('accessAllowed', async (event) => {
        // Listen to event fired when native stop button is clicked
        screenPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
            this.log.d('Clicked native stop button. Stopping screen sharing');
            this.toggleScreenShare();
          });
        this.log.d('ACCESS ALOWED screenPublisher');
        this.localUsersService.enableScreenUser(screenPublisher);

        if (!this.openViduWebRTCService.isScreenSessionConnected()) {
          await this.connectScreenSession();
        }
        await this.openViduWebRTCService.publishScreenPublisher();
        this.openViduWebRTCService.sendNicknameSignal();
        if (!this.localUsersService.hasWebcamVideoActive()) {
          // Disabling webcam
          this.localUsersService.disableWebcamUser();
          this.openViduWebRTCService.unpublishWebcamPublisher();
        }
      });

      screenPublisher.once('accessDenied', (event) => {
        this.log.w('ScreenShare: Access Denied');
      });
      return;
    }

    // Disabling screnShare and enabling webcam
    const hasAudio = this.localUsersService.hasScreenAudioActive();
    await this.openViduWebRTCService.publishWebcamPublisher();
    this.openViduWebRTCService.publishScreenAudio(false);
    this.openViduWebRTCService.publishWebcamAudio(hasAudio);
    this.localUsersService.enableWebcamUser();
    this.removeScreen();
  }

  toggleSpeakerLayout(): void {
    if (!this.localUsersService.isScreenShareEnabled()) {
      this.isAutoLayout = !this.isAutoLayout;

      this.log.d('Automatic Layout ', this.isAutoLayout ? 'Disabled' : 'Enabled');
      if (this.isAutoLayout) {
        this.subscribeToSpeechDetection();
        return;
      }
      this.log.d('Unsubscribe to speech detection');
      this.session.off('publisherStartSpeaking');
      this.resetAllBigElements();
      this.oVLayout.update();
      return;
    }
    this.log.w('Screen is enabled. Speech detection has been rejected');
  }

  onReplaceScreenTrack(event): void {
    this.openViduWebRTCService.replaceScreenTrack();
  }

  onToggleVideoSize(event: { element: HTMLElement; connectionId?: string; resetAll?: boolean }): void {
    const element = event.element;
    if (event.resetAll) {
      this.resetAllBigElements();
    }

    this.utilsSrv.toggleBigElementClass(element);

    // Has been mandatory change the user zoom property here because of
    // zoom icons and cannot handle publisherStartSpeaking event in other component
    if (event?.connectionId) {
      if (this.openViduWebRTCService.isMyOwnConnection(event.connectionId)) {
        this.localUsersService.toggleZoom(event.connectionId);
      } else {
        this.remoteUsersService.toggleUserZoom(event.connectionId);
      }
    }
    this.oVLayout.update();
  }

  toolbarMicIconEnabled(): boolean {
    if (this.localUsersService.isWebCamEnabled()) {
      return this.localUsersService.hasWebcamAudioActive();
    }
    return this.localUsersService.hasScreenAudioActive();
  }

  private async connectToSession(): Promise<void> {
    if (this.localUsersService.areBothConnected()) {
      await this.connectWebcamSession();
      await this.connectScreenSession();
      await this.openViduWebRTCService.publishWebcamPublisher();
      await this.openViduWebRTCService.publishScreenPublisher();
    } else if (this.localUsersService.isOnlyScreenConnected()) {
      await this.connectScreenSession();
      await this.openViduWebRTCService.publishScreenPublisher();
    } else {
      await this.connectWebcamSession();
      await this.openViduWebRTCService.publishWebcamPublisher();
    }
    // !Deprecated
    this._joinSession.emit();

    this.oVLayout.update();
  }

  private async connectScreenSession(): Promise<void> {
    try {
      await this.openViduWebRTCService.connectScreenSession(this.externalConfig.getScreenToken());
    } catch (error) {
      this._error.emit({
        error: error.error,
        messgae: error.message,
        code: error.code,
        status: error.status
      });
      this.log.e('There was an error connecting to the session:', error.code, error.message);
      this.utilsSrv.showErrorMessage('There was an error connecting to the session:', error?.error || error?.message);
    }
  }

  private async connectWebcamSession(): Promise<void> {
    try {
      await this.openViduWebRTCService.connectWebcamSession(this.externalConfig.getWebcamToken());
    } catch (error) {
      this._error.emit({
        error: error.error,
        messgae: error.message,
        code: error.code,
        status: error.status
      });
      this.log.e('There was an error connecting to the session:', error.code, error.message);
      this.utilsSrv.showErrorMessage('There was an error connecting to the session:', error?.error || error?.message);
    }
  }

  private subscribeToConnectionCreatedAndDestroyed(): void {
    this.session.on('connectionCreated', (event) => {
      if (!(event instanceof ConnectionEvent)) return;

      if (this.openViduWebRTCService.isMyOwnConnection(event.connection.connectionId)) {
        return;
      }

      const nickname: string = this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
      this.remoteUsersService.addUserName(event);

      // Adding participant when connection is created
      if (!nickname?.includes('_' + VideoType.SCREEN)) {
        this.remoteUsersService.add(event, null);
        this.openViduWebRTCService.sendNicknameSignal(event.connection);
      }
    });

    this.session.on('connectionDestroyed', (event) => {
      if (!(event instanceof ConnectionEvent)) return;

      if (this.openViduWebRTCService.isMyOwnConnection(event.connection.connectionId)) {
        return;
      }
      this.remoteUsersService.deleteUserName(event);
      const nickname: string = this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
      // Deleting participant when connection is destroyed
      if (!nickname?.includes('_' + VideoType.SCREEN)) {
        this.remoteUsersService.removeUserByConnectionId(event.connection.connectionId);
      }
    });
  }

  private subscribeToStreamCreated(): void {
    this.session.on('streamCreated', (event) => {
      if (!(event instanceof StreamEvent)) return;

      const connectionId = event.stream.connection.connectionId;

      if (this.openViduWebRTCService.isMyOwnConnection(connectionId)) {
        return;
      }

      const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
      this.remoteUsersService.add(event, subscriber);
      // this.oVSessionService.sendNicknameSignal(event.stream.connection);
    });
  }

  private subscribeToStreamDestroyed(): void {
    this.session.on('streamDestroyed', (event) => {
      if (!(event instanceof StreamEvent)) return;

      const connectionId = event.stream.connection.connectionId;
      this.remoteUsersService.removeUserByConnectionId(connectionId);
      // event.preventDefault();
    });
  }

  // Emit publisher to webcomponent
  emitPublisher(publisher: Publisher): void {
    this._publisher.emit(publisher);
  }

  private subscribeToStreamPropertyChange(): void {
    this.session.on('streamPropertyChanged', (event) => {
      if (!(event instanceof StreamPropertyChangedEvent)) return;

      const connectionId = event.stream.connection.connectionId;
      if (this.openViduWebRTCService.isMyOwnConnection(connectionId)) {
        return;
      }
      if (event.changedProperty === 'videoActive') {
        this.remoteUsersService.updateUsers();
      }
    });
  }

  private subscribeToNicknameChanged(): void {
    this.session.on('signal:nicknameChanged', (event: any) => {
      const connectionId = event.from.connectionId;
      if (this.openViduWebRTCService.isMyOwnConnection(connectionId)) {
        return;
      }
      const nickname = this.utilsSrv.getNicknameFromConnectionData(event.data);
      this.remoteUsersService.updateNickname(connectionId, nickname);
    });
  }

  private subscribeToSpeechDetection(): void {
    this.log.d('Subscribe to speech detection', this.session);
    // Has been mandatory change the user zoom property here because of
    // zoom icons and cannot handle publisherStartSpeaking event in other component
    this.session.on('publisherStartSpeaking', (event) => {
      if (!(event instanceof PublisherSpeakingEvent)) return;

      const someoneIsSharingScreen = this.remoteUsersService.someoneIsSharingScreen();
      if (!this.localUsersService.isScreenShareEnabled() && !someoneIsSharingScreen) {
        const elem = event.connection.stream.streamManager.videos[0].video;
        const element = this.utilsSrv.getHTMLElementByClassName(elem, LayoutType.ROOT_CLASS);
        this.resetAllBigElements();
        this.remoteUsersService.setUserZoom(event.connection.connectionId, true);
        this.onToggleVideoSize({ element });
      }
    });
  }

  private removeScreen(): void {
    this.localUsersService.disableScreenUser();
    this.openViduWebRTCService.unpublishScreenPublisher();
  }

  private subscribeToChatComponent(): void {
    this.chatSubscription = this.chatService.toggleChatObs.subscribe((opened) => {
      const timeout = this.externalConfig ? 300 : 0;
      this.oVLayout.update(timeout);
    });
  }

  private subscribeToReconnection(): void {
    this.session.on('reconnecting', () => {
      this.log.w('Connection lost: Reconnecting');
      this.isConnectionLost = true;
      this.utilsSrv.showErrorMessage('Connection Problem', 'Oops! Trying to reconnect to the session ...', true);
    });
    this.session.on('reconnected', () => {
      this.log.w('Connection lost: Reconnected');
      this.isConnectionLost = false;
      this.utilsSrv.closeDialog();
    });
    this.session.on('sessionDisconnected', (event) => {
      if (!(event instanceof SessionDisconnectedEvent)) return;

      if (event.reason === 'networkDisconnect') {
        this.utilsSrv.closeDialog();
        this.leaveSession(null);
      }
    });
  }

  private initScreenPublisher(): Publisher {
    const videoSource = ScreenType.SCREEN;
    const audioSource = this.hasAudioDevices ? undefined : null;
    const willThereBeWebcam = this.localUsersService.isWebCamEnabled() && this.localUsersService.hasWebcamVideoActive();
    const hasAudio = willThereBeWebcam ? false : this.hasAudioDevices && this.localUsersService.hasWebcamAudioActive();
    const properties = this.openViduWebRTCService.createPublisherProperties(videoSource, audioSource, true, hasAudio, false);

    try {
      return this.openViduWebRTCService.initPublisher(undefined, properties);
    } catch (error) {
      this.log.e(error);
      this.utilsSrv.handlerScreenShareError(error);
    }
  }

  private resetAllBigElements(): void {
    this.utilsSrv.removeAllBigElementClass();
    this.remoteUsersService.resetUsersZoom();
    this.localUsersService.resetUsersZoom();
  }

  private subscribeToLocalUsers(): void {
    this.oVUsersSubscription = this.localUsersService.OVUsers.subscribe((users: UserModel[]) => {
      this.localUsers = users;
      this.oVLayout.update();
    });
  }

  private subscribeToRemoteUsers(): void {
    this.remoteUsersSubscription = this.remoteUsersService.remoteUsers.subscribe((users: UserModel[]) => {
      this.remoteUsers = [...users];
      this.oVLayout.update();
    });

    this.remoteUserNameSubscription = this.remoteUsersService.remoteUserNameList.subscribe((names: UserName[]) => {
      this.participantsNameList = [...names];
    });
  }

  videoSizeClass(user: UserModel): string {
    return this.activitiesService.videoSizeClass(user.data.externalParticipantId);
  }
}
