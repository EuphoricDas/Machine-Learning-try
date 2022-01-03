import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDTO } from './location.dto';

export class ViewportDTO {
  @ApiProperty()
  @Prop()
  northeast: LocationDTO;

  @ApiProperty()
  @Prop()
  southwest: LocationDTO;
}
