import { ApiProperty } from '@nestjs/swagger';

export class ParticipantDTO {
  @ApiProperty()
  participantId: string;

  @ApiProperty()
  externalParticipantId: string;

  constructor(initialValues?: Partial<ParticipantDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
