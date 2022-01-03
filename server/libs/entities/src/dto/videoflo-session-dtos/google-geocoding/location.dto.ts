import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDTO {
  @ApiProperty()
  @Prop()
  lat: number;

  @ApiProperty()
  @Prop()
  lng: number;
}
