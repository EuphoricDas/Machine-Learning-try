import { Prop } from '@nestjs/mongoose';

export class QuorumEntry {
  @Prop()
  role: string;

  @Prop()
  noOfParticipants: number;

  constructor(initialValues?: Partial<QuorumEntry>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
