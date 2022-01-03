import { AccountUserRole, AuthenticatedUserDTO, ProjectDTO } from '@botaiml-videoflo/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedAccountUserDTO extends AuthenticatedUserDTO {
  @ApiProperty()
  public mostRecentlyUsedProject: number;

  @ApiProperty()
  public accountId: number;

  @ApiProperty()
  public accountName: string;

  @ApiProperty({
    enum: AccountUserRole
  })
  public role: AccountUserRole;

  @ApiProperty({
    type: [ProjectDTO]
  })
  public projects: Array<ProjectDTO>;

  constructor(initialValues?: Partial<AuthenticatedAccountUserDTO>) {
    super(initialValues);

    if (initialValues) Object.assign(this, initialValues);
  }
}
