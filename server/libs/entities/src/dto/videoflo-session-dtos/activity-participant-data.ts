import { Prop } from '@nestjs/mongoose';

export class ActivityParticipantData {
  @Prop({ type: Object })
  payload?: any;

  @Prop()
  gatheredFrom: string;

  @Prop()
  accepted?: boolean;

  @Prop()
  acceptedBy?: string;

  @Prop()
  rejectedBy?: string;

  constructor(initialValues?: Partial<ActivityParticipantData>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
