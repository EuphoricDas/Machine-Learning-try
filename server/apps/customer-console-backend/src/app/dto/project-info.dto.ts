import { UserRole, WorkflowRole } from '@botaiml-videoflo/entities';
import { ApiProperty } from '@nestjs/swagger';
export class ProjectInfoDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    enum: UserRole
  })
  loggedUserRole: UserRole;

  @ApiProperty()
  appId: string;

  @ApiProperty()
  secretKey: string;

  @ApiProperty()
  userCount: number;

  @ApiProperty({
    type: [WorkflowRole]
  })
  roles: WorkflowRole[];

  constructor(initialValues?: Partial<ProjectInfoDTO>) {
		if (initialValues) Object.assign(this, initialValues);
	  }
}
