/* eslint-disable @typescript-eslint/naming-convention */
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { AddressComponentsDTO } from './address-components.dto';
import { GeometryDTO } from './geometry.dto';

export class GeocodingResultDTO {
  @ApiProperty({
    type: [AddressComponentsDTO]
  })
  @Prop({
    type: [AddressComponentsDTO]
  })
  address_components: AddressComponentsDTO[];

  @ApiProperty()
  @Prop()
  formatted_address: string;

  @ApiProperty()
  @Prop()
  geometry: GeometryDTO;

  @ApiProperty()
  @Prop()
  place_id: string;

  @ApiProperty()
  @Prop()
  types: string[];
}
