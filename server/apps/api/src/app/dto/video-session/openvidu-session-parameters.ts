import { ApiProperty } from '@nestjs/swagger';
import { KurentoOptions, OpenViduRole } from '.';

export class OpenViduSessionParameters {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: OpenViduRole;

  @ApiProperty()
  data: string;

  @ApiProperty()
  kurentoOptions: KurentoOptions;

  constructor(initialValues?: Partial<OpenViduSessionParameters>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
