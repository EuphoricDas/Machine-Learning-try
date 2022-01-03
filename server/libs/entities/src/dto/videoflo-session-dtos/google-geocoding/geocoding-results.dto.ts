import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { GeocodingResultDTO } from './geocoding-result.dto';

export class GeocodingResultsDTO {
  @ApiProperty()
  @Prop()
  accuracy: number;

  @ApiProperty({
    type: [GeocodingResultDTO]
  })
  @Prop({
    type: [GeocodingResultDTO]
  })
  results: GeocodingResultDTO[];

  constructor(initialValues?: Partial<GeocodingResultsDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
