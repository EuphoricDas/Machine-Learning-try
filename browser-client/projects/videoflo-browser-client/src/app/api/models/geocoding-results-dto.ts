/* tslint:disable */
/* eslint-disable */
import { GeocodingResultDto } from './geocoding-result-dto';
export interface GeocodingResultsDto {
  accuracy: number;
  results: Array<GeocodingResultDto>;
}
