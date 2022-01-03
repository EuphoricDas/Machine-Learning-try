import { ActivityData, Participant, VideofloSessionDocument, WorkflowActivity } from '@botaiml-videoflo/entities';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsParticipantDTO } from '../dto/ws-participant.dto';
import { WorkflowRepoService } from '../services';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(private workflowRepoService: WorkflowRepoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const wsContext = context.switchToWs();

      const client: Socket = wsContext.getClient<Socket>();

      const authToken = <string>client.handshake?.query?.token;

      const userContext = await this.getUserContext(authToken, client.handshake.address);

      wsContext.getData().context = userContext;

      return Boolean(userContext);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  private async getUserContext(authToken: string, ipAddress: string): Promise<WsUserContext> {
    const participant = await this.workflowRepoService.getParticipantFromWsToken(authToken);

    if (participant) {
      const videoSessionId = participant.videoSessionId;

      const session = await this.workflowRepoService.getSessionById(videoSessionId);

      const currentActivity =
        session.currentActivityIndex >= 0 ? session.activities[session.currentActivityIndex] : null;

      const currentActivityData = currentActivity ? session.data[currentActivity.id] : null;

      return {
        ipAddress,
        participant: session.participants.find((p) => p.id === participant.participantId),
        session: session,
        activity: currentActivity,
        activityData: currentActivityData
      };
    }

    return null;
  }
}

export class WsUserContext {
  ipAddress: string;
  session: VideofloSessionDocument;
  participant: Participant;
  activity: WorkflowActivity;
  activityData: ActivityData;
}
