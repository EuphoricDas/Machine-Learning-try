import { ApiProperty } from '@nestjs/swagger';

export class ParticipantRequestInfoDTO {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  participantId: string;
}

export class VideoSessionParticipantInfoDTO extends ParticipantRequestInfoDTO {
  @ApiProperty()
  isScreenShareEnabled: boolean;
}
