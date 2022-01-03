import { ApiProperty } from '@nestjs/swagger';
export class LoginDTO {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  public password: string;
}
