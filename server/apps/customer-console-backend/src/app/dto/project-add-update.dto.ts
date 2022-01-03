import { WorkflowRole } from '@botaiml-videoflo/entities';
import { ApiProperty } from '@nestjs/swagger';
export class ProjectAddUpdateDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: [WorkflowRole]
  })
  roles: WorkflowRole[];
}
