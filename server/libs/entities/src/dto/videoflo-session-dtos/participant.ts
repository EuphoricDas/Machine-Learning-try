import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PrecallChecks } from './precall-checks';

export class ParticipantVideoLayout extends Map<string, string> {}

export class Participant {
  @Prop()
  id: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  role: string;

  @ApiProperty()
  @Prop()
  externalParticipantId: string;

  @ApiProperty()
  @Prop()
  precallChecks: PrecallChecks;

  @ApiProperty()
  @Prop({ type: Map, of: Object })
  videoLayoutSettings: ParticipantVideoLayout;

  @Prop()
  isConnected: boolean;

  constructor(initialValues?: Partial<Participant>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
