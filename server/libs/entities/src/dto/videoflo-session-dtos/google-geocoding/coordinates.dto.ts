import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesDTO {
  @ApiProperty()
  @Prop()
  accuracy: number;

  @ApiProperty()
  @Prop()
  latitude: number;

  @ApiProperty()
  @Prop()
  longitude: number;
}
