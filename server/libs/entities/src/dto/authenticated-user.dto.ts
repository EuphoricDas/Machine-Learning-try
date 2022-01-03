import { UserRole } from '@botaiml-videoflo/entities';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDTO {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public role?: UserRole | unknown;

  @ApiProperty()
  public token: string;

  constructor(initialValues?: Partial<AuthenticatedUserDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
