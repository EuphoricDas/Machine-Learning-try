import { ApiProperty } from '@nestjs/swagger';

export class KurentoOptions {
  @ApiProperty()
  videoMaxRecvBandwidth: number;

  @ApiProperty()
  videoMinRecvBandwidth: number;

  @ApiProperty()
  videoMaxSendBandwidth: number;

  @ApiProperty()
  videoMinSendBandwidth: number;

  @ApiProperty()
  allowedFilters: string[];
}
