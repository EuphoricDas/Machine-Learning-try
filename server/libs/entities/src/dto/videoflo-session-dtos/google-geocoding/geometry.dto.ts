/* eslint-disable @typescript-eslint/naming-convention */
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDTO } from './location.dto';
import { ViewportDTO } from './viewport.dto';

export class GeometryDTO {
  @ApiProperty()
  @Prop()
  location: LocationDTO;

  @ApiProperty()
  @Prop()
  location_type: string;

  @ApiProperty()
  @Prop()
  viewport: ViewportDTO;
}
