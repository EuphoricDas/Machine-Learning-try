/* tslint:disable */
/* eslint-disable */
import { AsnDto } from './asn-dto';
import { CurrencyDto } from './currency-dto';
import { LanguageDto } from './language-dto';
import { ThreatDto } from './threat-dto';
import { TimeZoneDto } from './time-zone-dto';
export interface IpLookupResponseDto {
  asn: AsnDto;
  calling_code: string;
  city: string;
  continent_code: string;
  continent_name: string;
  count: number;
  country_code: string;
  country_name: string;
  currency: CurrencyDto;
  emoji_flag: string;
  emoji_unicode: string;
  flag: string;
  ip: string;
  is_eu: boolean;
  languages: Array<LanguageDto>;
  latitude: number;
  longitude: number;
  postal: string;
  region: string;
  region_code: string;
  status: number;
  threat: ThreatDto;
  time_zone: TimeZoneDto;
}
