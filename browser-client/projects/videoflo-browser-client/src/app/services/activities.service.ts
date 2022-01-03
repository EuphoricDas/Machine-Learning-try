import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, Subscription } from 'rxjs';
import { ParticipantDto, PrecallChecks, PrecallChecksAwaitMessage, SessionJoinDto, VideoSessionJoinDto } from '../api/models';
import { ActivityDto } from '../api/models/activity-dto';
import { ClientApiService } from '../api/services/client-api.service';
import { ActivityParticipantData, ActivityPublishedData, WorkflowData } from '../models/activity-data';
import { ActivityItem } from '../models/activity-item';
import { WorkflowEvents } from '../models/workflow-events';
import { StreamComponent } from '../openvidu/components/stream/stream.component';
import { LoggerService } from '../openvidu/services/logger/logger.service';
import { LayoutClass } from '../openvidu/types/layout-type';
import { ILogger } from '../openvidu/types/logger-type';
import { OvSettings } from '../openvidu/types/ov-settings';
import { ActivityResult } from './activity-result';

declare type Unsubscribable = Subscription | Subject<any>;

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService implements OnDestroy {

  constructor(private clientApiService: ClientApiService, private loggerSrv: LoggerService) {
    this.logger = this.loggerSrv.get(this.constructor.name);

    this.precallChecksCompleted$ = this.precallChecksCompletedSubject.asObservable();
    this.subscriptions.push(this.precallChecksCompletedSubject);

    this.noQuorum$ = this.noQuorumSubject.asObservable();
    this.subscriptions.push(this.noQuorumSubject);

    this.attainedQuorum$ = this.attainedQuorumSubject.asObservable();
    this.subscriptions.push(this.attainedQuorumSubject);

    this.beginActivity$ = this.beginActivitySubject.asObservable();
    this.subscriptions.push(this.beginActivitySubject);

    this.onActivityStateChanged$ = this.onActivityStateChangedSubject.asObservable();
    this.subscriptions.push(this.onActivityStateChangedSubject);

    this.onActivityDataAvailable$ = this.onActivityDataAvailableSubject.asObservable();
    this.subscriptions.push(this.onActivityDataAvailableSubject);

    this.activitiesExhausted$ = this.activitiesExhaustedSubject.asObservable();
    this.subscriptions.push(this.activitiesExhaustedSubject);

    this.workflowFinished$ = this.workflowFinishedSubject.asObservable();
    this.subscriptions.push(this.workflowFinishedSubject);

    this.onCaptureImageRequest$ = this.onCaptureImageRequestSubject.asObservable();
    this.subscriptions.push(this.onCaptureImageRequestSubject);

    this.onCaptureImageResponse$ = this.onCaptureImageResponseSubject.asObservable();
    this.subscriptions.push(this.onCaptureImageResponseSubject);
  }

  get precallChecks(): PrecallChecks {
    return this._sessionJoinInfo.precallChecks;
  }

  get videofloSessionGuid(): string {
    return this._sessionJoinInfo?.sessionId;
  }

  get videofloSessionName(): string {
    return this._sessionJoinInfo?.sessionName;
  }

  get participantId(): string {
    return this._sessionJoinInfo?.participantId;
  }

  get externalParticipantId(): string {
    return this._sessionJoinInfo?.externalParticipantId;
  }

  get participantName(): string {
    return this._sessionJoinInfo?.participantName;
  }

  get participantRole(): string {
    return this._sessionJoinInfo?.role;
  }

  get openviduSessionId(): string {
    return this._sessionJoinInfo?.sessionId;
  }

  get activities(): ActivityDto[] {
    return this._sessionJoinInfo?.activities;
  }

  get tokens(): string[] {
    if (!this._videoSessionJoinInfo) {
      return [];
    }

    return this._videoSessionJoinInfo?.screenShareToken
      ? [this._videoSessionJoinInfo?.webcamToken, this._videoSessionJoinInfo?.screenShareToken]
      : [this._videoSessionJoinInfo?.webcamToken];
  }

  get ovSettings(): OvSettings {
    if (!this._ovSettings) {
      const settings = this._videoSessionJoinInfo.callUISettings;

      this._ovSettings = {
        autopublish: true,
        chat: settings.chat,
        footer: settings.footer,
        toolbar: settings.toolbar,
        toolbarButtons: {
          audio: settings.toolbarButtons.audio,
          video: settings.toolbarButtons.video,
          screenShare: settings.toolbarButtons.screenShare,
          fullscreen: settings.toolbarButtons.fullScreen,
          layoutSpeaking: settings.toolbarButtons.layoutSpeaking,
          exit: settings.toolbarButtons.exit
        }
      };
    }

    return this._ovSettings;
  }

  get webcamToken(): string {
    return this._videoSessionJoinInfo?.webcamToken;
  }

  get screenToken(): string {
    return this._videoSessionJoinInfo?.screenShareToken;
  }

  get isPrecallCheckRequired(): boolean {
    return !!this._sessionJoinInfo?.precallChecks && !this._sessionJoinInfo?.isPrecallChecksCompleted;
  }

  get awaitForPrecallChecks(): boolean {
    return this._sessionJoinInfo?.awaitForPrecallChecks;
  }

  get awaitMessage(): PrecallChecksAwaitMessage {
    return this._sessionJoinInfo?.awaitMessage;
  }
  private _ovSettings: OvSettings;

  private socket: Socket;

  private logger: ILogger;
  private precallChecksCompletedSubject = new Subject<any>();
  precallChecksCompleted$: Observable<any>;

  private noQuorumSubject = new Subject<any>();
  noQuorum$: Observable<any>;

  private attainedQuorumSubject = new Subject<any>();
  attainedQuorum$: Observable<any>;

  private beginActivitySubject = new Subject<ActivityItem>();
  beginActivity$: Observable<ActivityItem>;

  private onActivityStateChangedSubject = new Subject<any>();
  onActivityStateChanged$: Observable<any>;

  private onActivityDataAvailableSubject = new Subject<ActivityPublishedData>();
  onActivityDataAvailable$: Observable<ActivityPublishedData>;

  private activitiesExhaustedSubject = new Subject<WorkflowData>();
  activitiesExhausted$: Observable<WorkflowData>;

  private workflowFinishedSubject = new Subject<ActivityResult>();
  workflowFinished$: Observable<ActivityResult>;

  private onCaptureImageRequestSubject = new Subject<any>();
  onCaptureImageRequest$: Observable<any>;

  private onCaptureImageResponseSubject = new Subject<any>();
  onCaptureImageResponse$: Observable<any>;

  private subscriptions: Unsubscribable[] = [];

  private _sessionJoinInfo: SessionJoinDto;

  private _videoSessionJoinInfo: VideoSessionJoinDto;

  public wsRootUrl: string;
  public wsPath: string;

  private _workflowMessageHandlers: { [key: string]: (payload: any) => void } = {
    [WorkflowEvents.onPrecallChecksCompleted]: this.onPrecallChecksCompleted,
    [WorkflowEvents.onQuorumUpdate]: this.onQuorumUpdate,
    [WorkflowEvents.onBeginActivity]: this.onBeginActivity,
    [WorkflowEvents.onActivityStateChanged]: this.onActivityStateChanged,
    [WorkflowEvents.onActivityDataAvailable]: this.onActivityDataAvailable,
    [WorkflowEvents.onActivitiesExhausted]: this.onActivitiesExhausted,
    [WorkflowEvents.onWorkflowFinished]: this.onWorkflowFinished,
    [WorkflowEvents.onCaptureImageRequest]: this.onCaptureImageRequest,
    [WorkflowEvents.onCaptureImageResponse]: this.onCaptureImageResponse
  };

  // tslint:disable-next-line: member-ordering
  private videoSizes: any = {};

  async connect(videofloSessionId: string, participantId: string): Promise<void> {
    const tokenInfo = await this.clientApiService
      .getWsToken({
        body: {
          sessionId: videofloSessionId,
          participantId
        }
      })
      .toPromise();

    this.socket = new Socket({
      url: this.wsRootUrl,
      options: {
        transports: ['websocket'],
        // withCredentials: false,
        path: this.wsPath,
        query: {
          token: tokenInfo.accessToken
        }
      }
    });

    // tslint:disable-next-line: forin
    for (const event in this._workflowMessageHandlers) {
      this.socket.on(event, (payload) => {
        this._workflowMessageHandlers[event].apply(this, [payload]);
      });
    }

    this.socket.connect();
  }

  async getParticipant(participantId?: string, externalParticipantId?: string, role?: string): Promise<ParticipantDto> {
    return await this.clientApiService
      .getParticipantInfo({
        body: {
          sessionId: this._sessionJoinInfo.sessionId,
          participantId: participantId,
          externalParticipantId: externalParticipantId,
          role: role
        }
      })
      .toPromise();
  }

  initializeSession(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket.once(WorkflowEvents.initializeParticipantSession, (sessionJoinInfo: SessionJoinDto) => {
          this._sessionJoinInfo = sessionJoinInfo;

          resolve();
        });

        this.socket.emit(WorkflowEvents.initializeParticipantSession, {});
      } catch (err) {
        reject(err);
      }
    });
  }

  initializeVideoSession(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket.once(WorkflowEvents.initializeParticipantVideoSession, (videoSessionJoinInfo: VideoSessionJoinDto) => {
          this._videoSessionJoinInfo = videoSessionJoinInfo;

          resolve();
        });

        this.socket.emit(WorkflowEvents.initializeParticipantVideoSession, {});
      } catch (err) {
        reject(err);
      }
    });
  }

  initializeActivities() {
    this.sendWorkflowMessage(WorkflowEvents.initializeActivities, {});
  }

  onPrecallChecksCompleted(payload) {
    if (!payload.hasPendingPrecallChecks) {
      this.precallChecksCompletedSubject.next();
    }
  }

  onQuorumUpdate(payload) {
    if (payload.hasQuorum) {
      this.attainedQuorumSubject.next(true);
    } else {
      this.noQuorumSubject.next(true);
    }
  }

  onCaptureImageRequest(payload) {
    this.onCaptureImageRequestSubject.next(payload);
  }

  consentAcquired(data) {
    this.sendWorkflowMessage(WorkflowEvents.onConsentAcquired, data);
  }

  permissionsAcquired(data) {
    this.sendWorkflowMessage(WorkflowEvents.onPermissionsAcquired, data);
  }

  precallCustomChecklistCompleted(data) {
    this.sendWorkflowMessage(WorkflowEvents.onPrecallCustomChecklistCompleted, data);
  }

  precallChecksCompleted() {
    this.sendWorkflowMessage(WorkflowEvents.onPrecallChecksCompleted, {});
  }

  onCaptureImageResponse(payload) {
    this.onCaptureImageResponseSubject.next(payload);
  }

  onBeginActivity(payload) {
    this.beginActivitySubject.next(payload);
  }

  onActivityStateChanged(payload) {
    this.onActivityStateChangedSubject.next(payload);
  }

  onActivityDataAvailable(payload) {
    this.onActivityDataAvailableSubject.next(payload);
  }

  onActivitiesExhausted(payload: any) {
    this.activitiesExhaustedSubject.next(payload);
  }

  onWorkflowFinished(payload) {
    this.workflowFinishedSubject.next(payload);
  }

  onActivityAction(accepted: boolean, gatheredFrom: string, activityData: ActivityParticipantData) {
    activityData.gatheredFrom = gatheredFrom;

    activityData.accepted = accepted;

    if (accepted && !activityData.acceptedBy) {
      activityData.acceptedBy = this.participantId;
    }

    if (!accepted && !activityData.rejectedBy) {
      activityData.rejectedBy = this.participantId;
    }

    this.sendWorkflowMessage(WorkflowEvents.onActivityAction, {
      activityData
    });
  }

  publishActivityState(activityId: string, stateData: any) {
    this.sendWorkflowMessage(WorkflowEvents.onActivityStateChanged, {
      activityId,
      publishedBy: this.participantId,
      stateData
    });
  }

  submitActivityDataGathered(activityId: string, activityData: ActivityParticipantData, responseRequired?: boolean) {
    this.sendWorkflowMessage(WorkflowEvents.onActivityDataGathered, {
      activityId,
      activityData,
      responseRequired
    });
  }

  finishWorkflow(accepted: boolean) {
    this.sendWorkflowMessage(WorkflowEvents.onWorkflowFinished, { accepted });
  }

  private sendWorkflowMessage(eventName: WorkflowEvents, payload?: any) {
    this.socket.emit(eventName.toString(), payload);
  }

  requestForImage(data: any = {}) {
    this.sendWorkflowMessage(WorkflowEvents.onCaptureImageRequest, { ...data });
  }

  videoSizeClass(externalParticipantId: string): string {
    if (!this.videoSizes[externalParticipantId]) {
      const videoSize = this._videoSessionJoinInfo?.videoLayoutSettings[externalParticipantId];

      if (videoSize) {
        this.videoSizes[externalParticipantId] = videoSize === 'Big' ? LayoutClass.BIG_ELEMENT : LayoutClass.SMALL_ELEMENT;
      }
    }

    return this.videoSizes[externalParticipantId] || LayoutClass.SMALL_ELEMENT;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());

    // tslint:disable-next-line: forin
    for (const event in this._workflowMessageHandlers) {
      this.socket.removeAllListeners(event);
    }

    this.socket.disconnect();
  }
}
