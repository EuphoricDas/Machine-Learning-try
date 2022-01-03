/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PanRecognitionResponseDTO {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  errorCode: number;

  @ApiPropertyOptional()
  errorMessage: string;

  @ApiPropertyOptional()
  dob?: string;

  @ApiPropertyOptional()
  face_image?: string;

  @ApiPropertyOptional()
  father_name?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  pan_image?: string;

  @ApiPropertyOptional()
  pan_num?: string;

  @ApiPropertyOptional()
  signature_image?: string;
}
