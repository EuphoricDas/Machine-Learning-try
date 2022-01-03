import { ApiProperty } from '@nestjs/swagger';

export abstract class FaceApiResponseDTO {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  errorCode?: number;

  @ApiProperty()
  errorMessage?: string;
}
