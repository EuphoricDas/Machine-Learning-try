import {
  ActivityParticipantData,
  guid,
  Participant,
  PrecallChecks,
  PrecallChecksResponses,
  Project,
  QuorumEntry,
  VideofloSessionDocument,
  VideofloSessionsCollection,
  VideoSession,
  WorkflowData
} from '@botaiml-videoflo/entities';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { OpenViduApiService } from '.';
import { ApiTokenResponseDTO } from '../dto/api-token-request.dto';
import {
  ActivityDTO,
  CreateVideoSessionDTO,
  OpenViduRole,
  OpenViduSessionParameters,
  OpenViduTokenDTO,
  ParticipantDTO,
  ParticipantQuery,
  SessionDTO,
  SessionJoinDTO,
  VideoSessionJoinDTO
} from '../dto/video-session';
import { WsParticipantDTO } from '../dto/ws-participant.dto';

@Injectable()
export class WorkflowRepoService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(VideoSession)
    private readonly videoSessionRepo: Repository<VideoSession>,
    @InjectModel(VideofloSessionsCollection)
    private readonly sessionModel: Model<VideofloSessionDocument>,
    private readonly openviduService: OpenViduApiService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async createSession(projectId: number, session: CreateVideoSessionDTO): Promise<SessionDTO> {
    const newSessionId = guid();

    const project = await this.getProjectById(projectId);

    const quorumRequired: QuorumEntry[] = project.roles.map(
      (r) =>
        new QuorumEntry({
          role: r.name,
          noOfParticipants: r.minNoOfParticipants
        })
    );

    quorumRequired.forEach((role) => {
      const participantsAdded = session.participants.filter((p) => p.role === role.role).length;

      if (participantsAdded < role.noOfParticipants) {
        const participants = project.roles.filter((r) => r.minNoOfParticipants > 0);
        const requiredParticipantsByRole = participants.map((r) => `${r.name}: ${r.minNoOfParticipants}`);

        const addedParticipantsByRole = _(session.participants)
          .countBy('role')
          .map((k, v) => `${k}: ${v}`);

        const errorDetails = `Unable to create Videoflo session.

The project ${project.name} requires the following minimum participants:
  ${requiredParticipantsByRole}

The participants added in this request are:
  ${addedParticipantsByRole}`;

        throw new BadRequestException(errorDetails);
      }
    });

    if (session?.activities?.length < 1) {
      throw new BadRequestException('No workflow activities have been defined!');
    }

    // Check for duplicate activity ids
    const activityIds: string[] = [];
    const duplicateIds: string[] = [];

    session.activities.map((a) => {
      if (!activityIds.includes(a.id)) {
        activityIds.push(a.id);
      } else {
        duplicateIds.push(a.id);
      }
    });

    if (duplicateIds.length > 1) {
      throw new BadRequestException(
        `Invalid Activity IDs! The following Activity IDs have been assigned multiple times: [${duplicateIds.join(
          ', '
        )}]`
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (session.webhooks.onRecordingAvailable || session.webhooks.onRecordingError) {
      await this.httpService
        .post(this.configService.get('utilServer.registerWebhook'), {
          sessionID: newSessionId,
          url: this.configService.get('siteOvWebhookHandler')
        })
        .toPromise();
    }

    const createdOn = new Date();

    await this.videoSessionRepo.save({
      sessionId: newSessionId,
      name: session.name,
      createdOn: createdOn,
      projectId: projectId
    });

    session.participants.forEach((p) => {
      p.id = guid();

      // Make sure we do not inadvertantly store the participant with isConnected state while creating the session
      p.isConnected = false;

      // Make sure we do not inadvertantly store the precallChecks with isCompleted state while creating the session
      if (p.precallChecks) {
        p.precallChecks.isCompleted = false;
      } else {
        // At the very least, add the camera and microphone permissions for each participant
        p.precallChecks = new PrecallChecks({
          devicePermissions: {
            title: 'Give Permissions',
            subTitle: 'We need a few permissions before we can connect you to the video call',
            camera: 'Please give access to camera.',
            microphone: 'Please give access to microphone.'
          }
        });
      }
    });

    const workflowData: WorkflowData = {};

    for (const activity of session.activities.filter((s) => s.gatherFrom)) {
      workflowData[activity.id] = {};

      session.participants
        .filter((p) => activity.gatherFrom.includes(p.role))
        .forEach((p) => {
          workflowData[activity.id][p.id] = new ActivityParticipantData();
        });
    }

    const hasPrecallChecks = session.participants.filter(
      (p) =>
        !!p.precallChecks?.consent || !!p.precallChecks?.devicePermissions || p.precallChecks?.checklist?.length > 0
    );

    const newSession = await this.sessionModel.create({
      id: newSessionId,
      name: session.name,
      projectId: projectId,
      activities: session.activities,
      participants: session.participants,
      quorumRequired: quorumRequired,
      hasPrecallChecks: hasPrecallChecks,
      isPrecallChecksCompleted: hasPrecallChecks ? false : null,
      webhooks: session.webhooks,
      precallChecksResponses: hasPrecallChecks ? {} : null,
      data: workflowData,
      createdOn: createdOn,
      callEndedOn: null,
      callStartedOn: null
    });

    newSession.save();

    return new SessionDTO({
      sessionId: newSessionId,
      participants: session.participants.map(
        (p) =>
          new ParticipantDTO({
            participantId: p.id,
            externalParticipantId: p.externalParticipantId
          })
      )
    });
  }

  async initializeParticipantSession(
    projectId: number,
    sessionId: string,
    participantId: string
  ): Promise<SessionJoinDTO> {
    const session = await this.getSessionById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} was not found!`);
    }

    if (session.projectId !== projectId) {
      throw new UnauthorizedException(`Session does not belong to the current project!`);
    }

    const participant = session.participants.find((p) => p.id === participantId);

    if (!participant) {
      throw new NotFoundException(`Participant ${participantId} was not found!`);
    }

    const retVal = new SessionJoinDTO({
      sessionId: session.id,
      sessionName: session.name,
      participantId: participant.id,
      participantName: participant.name,
      externalParticipantId: participant.externalParticipantId,
      role: participant.role,
      precallChecks: participant.precallChecks,
      awaitForPrecallChecks: false,
      activities: session.activities.map(
        (a) =>
          new ActivityDTO({
            activityId: a.id,
            activityType: a.activityType
          })
      )
    });

    const awaitForParticipant = session.participants.find(
      (p) => p.id !== participantId && p.precallChecks?.awaitCallJoining && !p.precallChecks?.isCompleted
    );

    retVal.awaitForPrecallChecks = !!awaitForParticipant;

    if (retVal.awaitForPrecallChecks) {
      retVal.awaitMessage = awaitForParticipant.precallChecks.awaitMessage;
    }

    if (retVal.precallChecks) {
      // If precall check is already completed, we do not send the precallChecks object
      // to reduce the payload size
      if (retVal.isPrecallChecksCompleted) {
        delete retVal.precallChecks;
      }
    }

    return retVal;
  }

  async initializeParticipantVideoSession(
    projectId: number,
    sessionId: string,
    participantId: string,
    isScreenShareEnabled: boolean
  ) {
    const project = await this.getProjectById(projectId);

    const roles = project.roles;

    const session = await this.getSessionById(sessionId);

    if (!session) {
      throw new NotFoundException();
    }

    if (session.projectId !== projectId) {
      throw new UnauthorizedException();
    }

    const participant = session.participants.find((p) => p.id === participantId);

    if (!participant) {
      throw new NotFoundException();
    }

    const callUISettings = roles.find((x) => x.name === participant.role).callUISettings;

    const webcamToken = await this.createToken(session.id, participant, `Camera`);

    const retVal = new VideoSessionJoinDTO({
      webcamToken: webcamToken.token,
      callUISettings: callUISettings,
      videoLayoutSettings: participant.videoLayoutSettings
    });

    if (isScreenShareEnabled) {
      const screenShareTokenInfo = await this.createToken(session.id, participant, `ScreenSharing`);

      retVal.screenShareToken = screenShareTokenInfo.token;
    }

    return retVal;
  }

  async getProjectById(projectId: number): Promise<Project> {
    return await this.projectRepo.findOne({
      where: {
        id: projectId
      }
    });
  }

  async getSessionById(sessionId: string): Promise<VideofloSessionDocument> {
    return await this.sessionModel.findOne({
      id: sessionId
    });
  }

  async getParticipantInfo(projectId: number, participantQuery: ParticipantQuery): Promise<ParticipantDTO> {
    const session = await this.sessionModel.findOne({
      projectId: projectId,
      id: participantQuery.sessionId
    });

    let participant: Participant;

    if (participantQuery.participantId) {
      participant = session.participants.find((p) => p.id === participantQuery.participantId);
    } else if (participantQuery.externalParticipantId) {
      participant = session.participants.find(
        (p) => p.externalParticipantId === participantQuery.externalParticipantId
      );
    } else if (participantQuery.role) {
      participant = session.participants.find((p) => p.role === participantQuery.role);
    }

    return new ParticipantDTO({
      participantId: participant.id,
      externalParticipantId: participant.externalParticipantId
    });
  }

  async isQuorumAttained(session: VideofloSessionDocument): Promise<boolean> {
    const missingParticipantRoles = session.quorumRequired.filter(
      (qe) => session.participants.filter((p) => p.isConnected && p.role === qe.role).length < qe.noOfParticipants
    );

    return missingParticipantRoles.length < 1;
  }

  async getParticipantFromWsToken(authToken: string): Promise<WsParticipantDTO> {
    const decodedToken = this.jwtService.verify(authToken);

    const session = await this.getSessionById(decodedToken['sessionId']);

    const participant = session.participants.find((p) => p.id === decodedToken['participantId']);

    return {
      videoSessionId: session.id,
      participantId: participant.id,
      externalParticipantId: participant.externalParticipantId,
      name: participant.name,
      role: participant.role
    };
  }

  private async createToken(sessionId: string, participant: any, device: string): Promise<OpenViduTokenDTO> {
    const val = new OpenViduSessionParameters({
      id: sessionId,
      role: OpenViduRole.publisher,
      data: JSON.stringify({
        id: participant.id,
        externalParticipantId: participant.externalParticipantId,
        name: participant.name,
        role: participant.role,
        device: device
      })
    });

    return await this.openviduService.createToken(val);
  }

  createWebSocketToken(sessionId: string, participantId: string): ApiTokenResponseDTO {
    const payload = {
      sessionId,
      participantId
    };

    return new ApiTokenResponseDTO({
      accessToken: this.jwtService.sign(payload)
    });
  }
}
