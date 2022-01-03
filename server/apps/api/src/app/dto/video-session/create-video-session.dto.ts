import { Participant, WorkflowActivity } from '@botaiml-videoflo/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoSessionDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [Participant] })
  participants: Participant[];

  @ApiProperty({
    type: [WorkflowActivity]
  })
  public activities: WorkflowActivity[];

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      allOf: [{ type: 'string' }]
    }
  })
  webhooks: Map<string, string>;
}
