import { ApiProperty } from '@nestjs/swagger';

export class ParticipantQuery {
  @ApiProperty()
  sessionId: string;

  @ApiProperty({ required: false })
  participantId?: string;

  @ApiProperty({ required: false })
  externalParticipantId?: string;

  @ApiProperty({ required: false })
  role?: string;
}
