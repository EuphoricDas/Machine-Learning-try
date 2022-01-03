import { ApiProperty } from '@nestjs/swagger';

export class BoundingBoxDTO {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}
