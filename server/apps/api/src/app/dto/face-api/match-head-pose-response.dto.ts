import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MatchHeadPoseResultItem {
  @ApiProperty()
  imageId: number;

  @ApiProperty()
  result: boolean;

  @ApiPropertyOptional()
  errorCode?: number;

  @ApiPropertyOptional()
  errorMessage?: string;
}

export class MatchHeadPoseResponseDTO {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  errorCode?: number;

  @ApiPropertyOptional()
  errorMessage?: string;

  @ApiPropertyOptional({
    type: [MatchHeadPoseResultItem]
  })
  results?: MatchHeadPoseResultItem[];
}
