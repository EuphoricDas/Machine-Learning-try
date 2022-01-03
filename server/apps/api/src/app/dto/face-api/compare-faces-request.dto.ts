import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageSourceDTO {
  @ApiPropertyOptional()
  base64Image?: string;

  @ApiPropertyOptional()
  imageUrl?: string;
}

export class CompareFacesRequestDTO {
  @ApiProperty({ type: ImageSourceDTO })
  image1: ImageSourceDTO;

  @ApiProperty({ type: ImageSourceDTO })
  image2: ImageSourceDTO;
}
