/* tslint:disable */
/* eslint-disable */
import { ActivityDto } from './activity-dto';
import { PrecallChecks } from './precall-checks';
import { PrecallChecksAwaitMessage } from './precall-checks-await-message';
export interface SessionJoinDto {
  activities: Array<ActivityDto>;
  awaitForPrecallChecks: boolean;
  awaitMessage: PrecallChecksAwaitMessage;
  externalParticipantId: string;
  isPrecallChecksCompleted: boolean;
  participantId: string;
  participantName: string;
  precallChecks: PrecallChecks;
  role: string;
  sessionId: string;
  sessionName: string;
}
