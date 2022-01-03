import { ApiProperty } from '@nestjs/swagger';
import { OpenViduSessionParameters } from '.';

export class OpenViduTokenDTO extends OpenViduSessionParameters {
  @ApiProperty()
  session: string;

  @ApiProperty()
  token: string;
}
