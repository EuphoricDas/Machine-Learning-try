import { ApiProperty } from '@nestjs/swagger';
import { ParticipantDTO } from '.';

export class SessionDTO {
  @ApiProperty()
  sessionId: string;

  @ApiProperty({
    type: [ParticipantDTO]
  })
  participants: ParticipantDTO[];

  constructor(initialValues?: Partial<SessionDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
