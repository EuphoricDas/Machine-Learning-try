import { Prop, Schema } from '@nestjs/mongoose';
import { Participant, PrecallChecksResponses, QuorumEntry, WorkflowActivity, WorkflowData } from '.';

@Schema({ minimize: false })
export class VideofloSession {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop({
    type: Object
  })
  activities: WorkflowActivity[];

  @Prop({ type: Object })
  webhooks?: { [eventName: string]: string };

  @Prop({ type: Object })
  precallChecksResponses: { [particpantId: string]: PrecallChecksResponses };

  @Prop({ type: Object })
  data: WorkflowData;

  @Prop()
  createdOn: Date;

  @Prop()
  callStartedOn: Date;

  @Prop()
  callEndedOn: Date;

  @Prop()
  projectId: number;

  @Prop()
  participants: Participant[];

  @Prop()
  quorumRequired: QuorumEntry[];

  @Prop()
  currentActivityIndex?: number;

  @Prop()
  isCompleted?: boolean;

  @Prop()
  finalResultAccepted?: boolean;

  @Prop()
  finalResultAcceptedBy?: string;

  @Prop()
  finalResultRejected?: boolean;

  @Prop()
  finalResultRejectedBy?: string;

  constructor(initialValues?: Partial<VideofloSession>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
