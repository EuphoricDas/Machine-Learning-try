/* eslint-disable @typescript-eslint/naming-convention */
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class AddressComponentsDTO {
  @ApiProperty()
  @Prop()
  long_name: string;

  @ApiProperty()
  @Prop()
  short_name: string;

  @ApiProperty()
  @Prop()
  types: string[];
}
