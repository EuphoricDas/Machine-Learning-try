/* eslint-disable @typescript-eslint/member-ordering */
import {
  CoordinatesDTO,
  GeocodingResultsDTO,
  IpLookupResponseDTO, PrecallChecksChecklistResponses,
  PrecallChecksResponses,
  VideofloSessionDocument,
  VideofloSessionsCollection
} from '@botaiml-videoflo/entities';
import { HttpService } from '@nestjs/axios';
import { ConflictException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { WebSocketAuthGuard, WsUserContext } from '../auth/websocket.guard';
import { WorkflowEvents } from '../dto/video-session';
import { IplookupService, OpenViduApiService, WorkflowRepoService } from '../services';
import { WebhookService } from '../services/webhook.service';

@UseGuards(WebSocketAuthGuard)
@WebSocketGateway({ transports: 'websocket' })
export class WorkflowGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly workflowRepoService: WorkflowRepoService,
    private readonly openviduApiService: OpenViduApiService,
    private readonly ipLookupService: IplookupService,
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(VideofloSessionsCollection)
    private readonly sessionModel: Model<VideofloSessionDocument>
  ) {}

  public async handleConnection(client: Socket, ...args: any[]) {
    await this.handleConnectOrDisconnect(client, true);
  }

  public async handleDisconnect(client: Socket) {
    await this.handleConnectOrDisconnect(client, false);
  }

  @SubscribeMessage(WorkflowEvents.initializeParticipantSession)
  public async initializeParticipantSession(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    const projectId = ctx.session.projectId;

    const sessionJoinInfo = await this.workflowRepoService.initializeParticipantSession(
      projectId,
      ctx.session.id,
      ctx.participant.id
    );

    return {
      event: WorkflowEvents.initializeParticipantSession,
      data: sessionJoinInfo
    };
  }

  @SubscribeMessage(WorkflowEvents.initializeParticipantVideoSession)
  public async initializeParticipantVideoSession(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    const projectId = ctx.session.projectId;

    // Create the session in OpenVidu. This method does not throw an error if the session already exists.
    // So no additional checks are needed before calling it!
    await this.openviduApiService.createSession(ctx.session.id);

    const videoSessionInfo = await this.workflowRepoService.initializeParticipantVideoSession(
      projectId,
      ctx.session.id,
      ctx.participant.id,
      data.isScreenShareEnabled
    );

    return {
      event: WorkflowEvents.initializeParticipantVideoSession,
      data: videoSessionInfo
    };
  }

  private updatePrecallCheckResponses(
    session: VideofloSessionDocument,
    participantId: string,
    updateFn: (responses: PrecallChecksResponses) => void
  ) {
    if (!session.precallChecksResponses) {
      session.precallChecksResponses = {};
    }

    if (!session.precallChecksResponses[participantId]) {
      session.precallChecksResponses[participantId] = new PrecallChecksResponses({});
    }

    updateFn(session.precallChecksResponses[participantId]);

    session.markModified('precallChecksResponses');
    session.save();
  }

  @SubscribeMessage(WorkflowEvents.onConsentAcquired)
  public async onConsentAcquired(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    this.updatePrecallCheckResponses(ctx.session, ctx.participant.id, (resp) => {
      resp.consentTimestamp = data.consentTimestamp;
    });
  }

  @SubscribeMessage(WorkflowEvents.onPermissionsAcquired)
  public async onPermissionsAcquired(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    let geoLocation: GeocodingResultsDTO = null;

    if (data.geoCoordinates) {
      const coords: CoordinatesDTO = data.geoCoordinates;

      const url =
        'https://maps.googleapis.com/maps/api/geocode/json?' +
        `latlng=${coords.latitude},${coords.longitude}&key=${this.configService.get('googleGeoCodingKey')}`;

      const response = await this.httpService.get(url).toPromise();

      if (response.data) {
        geoLocation = new GeocodingResultsDTO({
          accuracy: coords.accuracy,
          results: response.data.results
        });
      }
    }

    let ipInformation: IpLookupResponseDTO = null;

    if (ctx.participant.precallChecks?.devicePermissions?.ipAddress) {
      ipInformation = await this.ipLookupService.lookup(ctx.ipAddress);
    }

    this.updatePrecallCheckResponses(ctx.session, ctx.participant.id, (resp) => {
      resp.locationPermissionTimestamp = data.locationPermissionTimestamp;
      resp.cameraPermissionTimestamp = data.cameraPermissionTimestamp;
      resp.microphonePermissionTimestamp = data.microphonePermissionTimestamp;
      resp.geoLocation = geoLocation;

      if (ipInformation) {
        resp.ipInformation = ipInformation;
      }
    });
  }

  @SubscribeMessage(WorkflowEvents.onPrecallCustomChecklistCompleted)
  public async onPrecallCustomChecklistCompleted(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    this.updatePrecallCheckResponses(ctx.session, ctx.participant.id, (resp) => {
      if (!resp.checklists) resp.checklists = new PrecallChecksChecklistResponses();

      resp.checklists[data.checklistId] = data.timestamp;
    });
  }

  @SubscribeMessage(WorkflowEvents.onPrecallChecksCompleted)
  public async onPrecallChecksCompleted(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    ctx.participant.precallChecks.isCompleted = true;

    ctx.session.markModified('participants');
    ctx.session.save();

    const hasPendingPrecallChecks = ctx.session.participants.some(
      (p) => p.precallChecks?.awaitCallJoining && !p.precallChecks?.isCompleted
    );

    const room = this.getRoom(ctx.session.id);

    room.emit(WorkflowEvents.onPrecallChecksCompleted, {
      hasPendingPrecallChecks
    });
  }

  @SubscribeMessage(WorkflowEvents.initializeActivities)
  public async initializeActivities(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;

    const session = ctx.session;

    const room = this.getRoom(ctx.session.id);

    // important: quorumUpdate should always be before we start pushing any data related to workflow activities.
    // The browser-client kind of blocks execution of the workflow until there is quorum.
    const hasQuorum = await this.workflowRepoService.isQuorumAttained(session);

    room.emit(WorkflowEvents.onQuorumUpdate, { hasQuorum });

    if (hasQuorum) {
      // Start at the current workflow activity as per the status
      let activityIndex = session.currentActivityIndex;

      // If workflow not yet started, then activityIndex will be -1. So we start from the first activity
      if (activityIndex < 0) {
        activityIndex = 0;
      }

      await this.executeWorkflowActivityByIndex(session, activityIndex, room);
    }

    const sessionData = await this.sessionModel.findOne({ id: session.id });

    if (!sessionData.callStartedOn) {
      await this.sessionModel.updateOne({ id: session.id }, { callStartedOn: new Date() });
    }

    // await this.sessionModel.updateOne({ id: session.id }, { callEndedOn: new Date() });
  }

  @SubscribeMessage(WorkflowEvents.onActivityStateChanged)
  public async onActivityStateChanged(@MessageBody() data: any) {
    const room = this.getRoom(data.context.session.id);

    delete data.context;

    room.emit(WorkflowEvents.onActivityStateChanged, data);
  }

  @SubscribeMessage(WorkflowEvents.onCaptureImageRequest)
  public async onCaptureRequestImage(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;
    const room = this.getRoom(ctx.session.id);

    if (data?.type === 'request') {
      room.emit(WorkflowEvents.onCaptureImageRequest, {
        type: 'response',
        requestData: data?.requestData
      });
      return;
    } else if (data?.type === 'responseImage') {
      room.emit(WorkflowEvents.onCaptureImageResponse, {
        type: 'responseImage',
        responseData: data?.responseData ?? 'image'
      });
    }
  }

  @SubscribeMessage(WorkflowEvents.onActivityDataGathered)
  public async onActivityDataGathered(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;
    const room = this.getRoom(ctx.session.id);

    if (ctx.activity.id !== data.activityId) throw new ConflictException('activityId mismatch!');

    let existingResponse: any = ctx.activityData[data.activityData.gatheredFrom];

    if (!existingResponse) {
      ctx.activityData[data.activityData.gatheredFrom] = existingResponse = {
        gatheredFrom: data.activityData.gatheredFrom
      };
    }

    existingResponse.payload = data.activityData.payload;
    const responseRequired = data?.responseRequired;

    // Update session state in mongodb
    ctx.session.markModified(`data.${ctx.activity.id}.${data.activityData.gatheredFrom}`);
    await ctx.session.save();

    room.emit(WorkflowEvents.onActivityDataAvailable, {
      activityId: ctx.activity.id,
      data: ctx.activityData
    });

    if (ctx.activity.onActivityDataGathered) {
      await this.webhookService.callWebhook(
        WorkflowEvents.onActivityDataGathered,
        ctx.session,
        () => ({
          sessionId: ctx.session.id,
          activityId: ctx.activity.id,
          data: existingResponse,
          responseRequired
        }),
        true
      );
    }
  }

  @SubscribeMessage(WorkflowEvents.onActivityAction)
  public async onActivityAction(@MessageBody() data: any) {
    const ctx = <WsUserContext>data.context;
    const room = this.getRoom(ctx.session.id);

    const existingResponse = ctx.activityData[data.activityData.gatheredFrom];

    existingResponse.payload = data.activityData.payload;

    existingResponse.accepted = data.activityData.accepted;

    if (existingResponse.accepted) {
      existingResponse.acceptedBy = ctx.participant.id;
    } else {
      existingResponse.rejectedBy = ctx.participant.id;
    }

    if (ctx.activity.onActivityAction) {
      await this.webhookService.callWebhook(
        WorkflowEvents.onActivityAction,
        ctx.session,
        () => ({
          sessionId: ctx.session.id,
          activityId: ctx.activity.id,
          data: existingResponse
        }),
        true
      );
    }

    // Update session state in redis
    ctx.session.markModified(`data.${ctx.activity.id}.${data.activityData.gatheredFrom}`);

    await ctx.session.save();

    const nextActivityIndex = ctx.session.currentActivityIndex + 1;

    await this.executeWorkflowActivityByIndex(ctx.session, nextActivityIndex, room);

    return ctx.session;
  }

  @SubscribeMessage(WorkflowEvents.onWorkflowFinished)
  public async onWorkflowFinished(@MessageBody() data: any) {
    const accepted: boolean = data.accepted;

    const ctx = <WsUserContext>data.context;
    const room = this.getRoom(ctx.session.id);

    ctx.session.finalResultAccepted = accepted;
    ctx.session.finalResultAcceptedBy = accepted ? ctx.participant.id : undefined;

    ctx.session.finalResultRejected = !accepted;
    ctx.session.finalResultRejectedBy = !accepted ? ctx.participant.id : undefined;

    await ctx.session.save();

    room.emit(WorkflowEvents.onWorkflowFinished, {
      resultState: accepted ? 'accepted' : 'rejected'
    });

    await this.webhookService.callWebhook(
      WorkflowEvents.onWorkflowFinished,
      ctx.session,
      () => ({
        sessionId: ctx.session.id,
        data: ctx.session.data,
        accepted: accepted
      }),
      true
    );

    await this.openviduApiService.endSession(ctx.session.id);
  }

  private async handleConnectOrDisconnect(client: Socket, isConnected: boolean): Promise<void> {
    const authToken = <string>client.handshake?.query?.token;
    const ipAddress = client.handshake.address;

    const { videoSessionId, participantId } = await this.workflowRepoService.getParticipantFromWsToken(authToken);

    const session = await this.workflowRepoService.getSessionById(videoSessionId);

    if (!session) return;

    const participant = session.participants.find((p) => p.id === participantId);
    participant.isConnected = isConnected;

    session.markModified('participants');
    await session.save();

    const roomKey = this.getRoomKey(videoSessionId);

    if (isConnected) {
      client.join(roomKey);
    } else {
      client.leave(roomKey);
    }

    await this.webhookService.callWebhook(
      isConnected ? WorkflowEvents.onParticipantConnected : WorkflowEvents.onParticipantDisconnected,
      session,
      () => ({
        sessionId: session.id,
        connectionState: isConnected ? 'connected' : 'disconnected',
        participantId: participant.id,
        externalParticipantId: participant.externalParticipantId,
        role: participant.role
      }),
      true
    );
  }

  private async executeWorkflowActivityByIndex(
    session: VideofloSessionDocument,
    activityIndex: number,
    room: any
  ): Promise<void> {
    if (!activityIndex) activityIndex = 0;

    if (!session.isCompleted && activityIndex < session.activities.length) {
      session.currentActivityIndex = activityIndex;

      // We update the state immediately, because a different thread may access the state
      // as a result of the emit call below. So we want to keep the state consistent
      await session.save();

      const currentActivity = session.activities[session.currentActivityIndex];

      room.emit(WorkflowEvents.onBeginActivity, {
        activity: currentActivity,
        data: session.data[currentActivity?.id]
      });
    } else {
      session.isCompleted = true;

      // We update the state immediately, because a different thread may access the state
      // as a result of the emit call below. So we want to keep the state consistent
      await session.save();

      room.emit(WorkflowEvents.onActivitiesExhausted, session.data);
    }
  }

  private getRoom(videoSessionId: string): any {
    return this.server.to(this.getRoomKey(videoSessionId));
  }

  private getRoomKey(videoSessionId: string): string {
    return `sessionId:${videoSessionId}`;
  }
}
