/* eslint-disable @typescript-eslint/naming-convention */
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AsnDTO {
  @ApiProperty()
  @Prop()
  asn: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  domain: string;

  @ApiProperty()
  @Prop()
  route: string;

  @ApiProperty()
  @Prop()
  type: string;
}

export class CurrencyDTO {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  code: string;

  @ApiProperty()
  @Prop()
  symbol: string;

  @ApiProperty()
  @Prop()
  native: string;

  @ApiProperty()
  @Prop()
  plural: string;
}

export class LanguageDTO {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  native: string;
}

export class ThreatDTO {
  @ApiProperty()
  @Prop()
  is_tor: boolean;

  @ApiProperty()
  @Prop()
  is_proxy: boolean;

  @ApiProperty()
  @Prop()
  is_anonymous: boolean;

  @ApiProperty()
  @Prop()
  is_known_attacker: boolean;

  @ApiProperty()
  @Prop()
  is_known_abuser: boolean;

  @ApiProperty()
  @Prop()
  is_threat: boolean;

  @ApiProperty()
  @Prop()
  is_bogon: boolean;
}

export class TimeZoneDTO {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  abbr: string;

  @ApiProperty()
  @Prop()
  offset: string;

  @ApiProperty()
  @Prop()
  is_dst: boolean;

  @ApiProperty()
  @Prop()
  current_time: string;
}

export class IpLookupResponseDTO {
  @ApiProperty()
  @Prop()
  ip: string;

  @ApiProperty()
  @Prop()
  is_eu: boolean;

  @ApiProperty()
  @Prop()
  city?: string;

  @ApiProperty()
  @Prop()
  region?: string;

  @ApiProperty()
  @Prop()
  region_code?: string;

  @ApiProperty()
  @Prop()
  country_name: string;

  @ApiProperty()
  @Prop()
  country_code: string;

  @ApiProperty()
  @Prop()
  continent_name: string;

  @ApiProperty()
  @Prop()
  continent_code: string;

  @ApiProperty()
  @Prop()
  latitude: number;

  @ApiProperty()
  @Prop()
  longitude: number;

  @ApiProperty()
  @Prop()
  postal?: string;

  @ApiProperty()
  @Prop()
  calling_code: string;

  @ApiProperty()
  @Prop()
  flag: string;

  @ApiProperty()
  @Prop()
  emoji_flag: string;

  @ApiProperty()
  @Prop()
  emoji_unicode: string;

  @ApiProperty({ type: AsnDTO })
  @Prop({ type: AsnDTO })
  asn: AsnDTO;

  @ApiProperty({
    type: [LanguageDTO]
  })
  @Prop({
    type: [LanguageDTO]
  })
  languages: LanguageDTO[];

  @ApiProperty({ type: CurrencyDTO })
  @Prop({ type: CurrencyDTO })
  currency: CurrencyDTO;

  @ApiProperty({ type: TimeZoneDTO })
  @Prop({ type: TimeZoneDTO })
  time_zone: TimeZoneDTO;

  @ApiProperty({ type: ThreatDTO })
  @Prop({ type: ThreatDTO })
  threat: ThreatDTO;

  @ApiProperty()
  @Prop()
  count: number;

  @ApiProperty()
  @Prop()
  status: number;

  constructor(initialValues?: Partial<IpLookupResponseDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
