import { ApiProperty } from '@nestjs/swagger';

export class OpenViduWebhookResponse {
  @ApiProperty({ required: false })
  sessionId?: string;

  @ApiProperty({ required: false })
  uniqueSessionId?: string;

  @ApiProperty({ required: false })
  timestamp?: number;

  @ApiProperty({ required: false })
  startTime?: number;

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  outputMode?: string;

  @ApiProperty({ required: false })
  resolution?: string;

  @ApiProperty({ required: false })
  recordingLayout?: string;

  @ApiProperty({ required: false })
  hasAudio?: boolean;

  @ApiProperty({ required: false })
  hasVideo?: boolean;

  @ApiProperty({ required: false })
  size?: number;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  event?: string;
}
