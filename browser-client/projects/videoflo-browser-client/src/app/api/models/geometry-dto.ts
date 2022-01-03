/* tslint:disable */
/* eslint-disable */
import { LocationDto } from './location-dto';
import { ViewportDto } from './viewport-dto';
export interface GeometryDto {
  location: LocationDto;
  location_type: string;
  viewport: ViewportDto;
}
