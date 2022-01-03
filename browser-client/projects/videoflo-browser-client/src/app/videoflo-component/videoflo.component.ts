/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-output-native */
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionEvent, Publisher } from 'openvidu-browser';
import { Subscription } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';
import { PrecallChecks } from '../api/models';
import { WebComponentModel } from '../openvidu/models/webcomponent-model';
import { LoggerService } from '../openvidu/services/logger/logger.service';
import { ILogger } from '../openvidu/types/logger-type';
import { ActivitiesService } from '../services/activities.service';
import { TokenService } from '../services/token.service';
import { ModalDialogComponent } from '../shared/modal-dialog/modal-dialog.component';
import { VideoRoomComponent } from '../video-room/video-room.component';
import { ISessionInfo } from './../openvidu/types/webcomponent-config';

@Component({
  selector: 'videoflo-component',
  templateUrl: './videoflo.component.html',
  styleUrls: ['./videoflo.component.css']
})
export class VideofloComponent implements AfterViewInit, OnDestroy {
  constructor(
    private tokenService: TokenService,
    private activitiesService: ActivitiesService,
    private loggerSrv: LoggerService,
    private apiConfiguration: ApiConfiguration,
    public dialog: MatDialog
  ) {
    this.log = this.loggerSrv.get('VideofloComponent');
  }

  @Input() set apiUrl(rootUrl: string) {
    this.apiConfiguration.rootUrl = rootUrl;

    const url = new URL(rootUrl);

    this.activitiesService.wsRootUrl = `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.host}`;

    this.activitiesService.wsPath = url.pathname !== '/' ? `/${url.pathname}/socket.io` : '/socket.io';
  }

  @Input() set sessionId(value: string) {
    this._sessionId = value;
  }

  @Input() set participantId(value: string) {
    this._participantId = value;
  }

  @Input() set token(value: string) {
    this._token = value;
  }

  // @Input('start')
  // get start(): boolean {
  //   return this.startVideoCall();
  // }

  get isValidSessionData(): boolean {
    return !!this.apiConfiguration.rootUrl && !!this._sessionId && !!this._participantId && !!this._token;
  }

  @Input()
  set theme(theme: string) {
    this.externalConfig.setTheme(theme);
  }

  @Output() sessionCreated = new EventEmitter<any>();

  @Output() publisherCreated = new EventEmitter<any>();

  @Output() error = new EventEmitter<any>();

  @Output() joinSession = new EventEmitter<any>();

  @Output() leaveSession = new EventEmitter<any>();

  @ViewChild(VideoRoomComponent) videoRoom: VideoRoomComponent;

  externalConfig: WebComponentModel = new WebComponentModel();

  precallChecks: PrecallChecks;

  private log: ILogger;

  precallCheckCompletedSubscription: Subscription;

  private _sessionId: string = null;

  private _participantId: string = null;

  private _token: string = null;

  isPreCallChecksCompleted = true;

  isVideoInitialized = false;

  private dialogRef: any;

  ngAfterViewInit() {
    this.startVideofloSession();
  }

  onCurrentParticipantPrecallChecksCompleted() {
    let title = 'Thank you!';
    let description = 'Please wait while we connect you to the video call.';

    if (!!this.activitiesService.awaitMessage) {
      title = this.activitiesService.awaitMessage.title;
      description = this.activitiesService.awaitMessage.description;
    }

    this.showAwaitingConnectionDialog(title, description);
  }

  private startVideofloSession() {
    if (!this.isValidSessionData) {
      setTimeout(() => {
        this.startVideofloSession();
      }, 100);
      return;
    }

    setTimeout(async () => {
      this.tokenService.token = this._token;

      await this.activitiesService.connect(this._sessionId, this._participantId);

      this.precallCheckCompletedSubscription = this.activitiesService.precallChecksCompleted$.subscribe(async () => {
        this.closeAwaitingConnectionDialog();

        await this.initializeVideoCall();
      });

      await this.activitiesService.initializeSession();

      if (this.activitiesService.isPrecallCheckRequired) {
        this.isPreCallChecksCompleted = false;
        this.precallChecks = this.activitiesService.precallChecks;
      } else if (this.activitiesService.awaitForPrecallChecks) {
        this.showAwaitingConnectionDialog(this.activitiesService.awaitMessage.title, this.activitiesService.awaitMessage.description);
      } else {
        await this.initializeVideoCall();
      }
    }, 100);
  }

  async initializeVideoCall(): Promise<void> {
    try {
      this.isPreCallChecksCompleted = true;

      await this.activitiesService.initializeVideoSession();

      this.isVideoInitialized = true;

      const sessionInfo: ISessionInfo = {
        sessionId: this._sessionId,
        participantId: this._participantId,
        participantName: this.activitiesService.participantName,
        sessionName: this.activitiesService.videofloSessionName,
        tokens: this.activitiesService.tokens,
        ovSettings: this.activitiesService.ovSettings
      };

      this.externalConfig.setSessionInfo(sessionInfo);
    } catch (error) {
      this.isVideoInitialized = false;
      if (error.status === 404) {
        this.emitErrorEvent(new Error('This session has expired!'));
      }
      this.emitErrorEvent(error);
      throw error;
    }
  }

  showAwaitingConnectionDialog(header: string, message: string, showProgressBar = true) {
    this.dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { header, message, showProgressBar },
      disableClose: true,
      hasBackdrop: true
    });
  }

  closeAwaitingConnectionDialog() {
    this.dialogRef?.close();
  }

  emitErrorEvent(event): void {
    this.error.emit(event);
  }

  emitSession(session: any): void {
    session.on('sessionDisconnected', (e) => {
      this.log.d('sessionDisconnected', e);
      this.cleanup();
    });
    session.on('connectionCreated', (e: ConnectionEvent) => {
      this.log.d('connectionCreated', e);
      this.videoRoom.adjustLayout();
    });
    this.sessionCreated.emit(session);
  }

  emitPublisher(publisher: Publisher): void {
    this.publisherCreated.emit(publisher);
  }

  // !Deprecated
  emitJoinSessionEvent(event): void {
    // Do not work. Observers always are 1 in webcomponent.
    // if (this.joinSession.observers.length > 0) {
    // 	this.log.w('joinSession event is DEPRECATED. Please consider to use sessionCreated event');
    // }
    this.joinSession.emit(event);
  }

  // !Deprecated
  emitLeaveSessionEvent(event): void {
    // Do not work. Observers always are 1 in webcomponent.
    // if (this.leaveSession.observers.length > 0) {
    // 	this.log.w('leaveSession event is DEPRECATED. Please consider to use sessionCreated event');
    // }
    this.leaveSession.emit(event);
  }

  cleanup() {
    if (!!this.precallCheckCompletedSubscription) {
      this.precallCheckCompletedSubscription.unsubscribe();
    }

    this.activitiesService.ngOnDestroy();
  }

  ngOnDestroy() {
    this.cleanup();
  }
}
