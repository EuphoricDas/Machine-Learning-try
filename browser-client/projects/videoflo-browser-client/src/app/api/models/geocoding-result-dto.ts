/* tslint:disable */
/* eslint-disable */
import { AddressComponentsDto } from './address-components-dto';
import { GeometryDto } from './geometry-dto';
export interface GeocodingResultDto {
  address_components: Array<AddressComponentsDto>;
  formatted_address: string;
  geometry: GeometryDto;
  place_id: string;
  types: Array<string>;
}
