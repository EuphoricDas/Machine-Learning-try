import { ApiProperty } from '@nestjs/swagger';

export class OpenViduSessionDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;
}
