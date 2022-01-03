import { CallUiSettings, ParticipantVideoLayout, PrecallChecks, PrecallChecksAwaitMessage } from '@botaiml-videoflo/entities';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ActivityDTO } from '.';

export class SessionJoinDTO {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  sessionName: string;

  @ApiProperty()
  participantId: string;

  @ApiProperty()
  externalParticipantId: string;

  @ApiProperty()
  participantName: string;

  @ApiProperty()
  role: string;

  @ApiProperty({
    type: [ActivityDTO],
    allOf: [
      { $ref: getSchemaPath(ActivityDTO) }
    ]
  })
  activities: ActivityDTO[];

  @ApiProperty({ type: PrecallChecks })
  precallChecks: PrecallChecks;

  @ApiProperty()
  isPrecallChecksCompleted: boolean;

  @ApiProperty()
  awaitForPrecallChecks: boolean;

  @ApiProperty()
  awaitMessage: PrecallChecksAwaitMessage;

  constructor(initialValues?: Partial<SessionJoinDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}

export class VideoSessionJoinDTO {
  @ApiProperty()
  webcamToken: string;

  @ApiProperty()
  screenShareToken: string;

  @ApiProperty()
  callUISettings: CallUiSettings;

  @ApiProperty({
    type: Object,
    additionalProperties: {
      allOf: [{ type: 'string' }]
    }
  })
  videoLayoutSettings: ParticipantVideoLayout;

  constructor(initialValues?: Partial<VideoSessionJoinDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
