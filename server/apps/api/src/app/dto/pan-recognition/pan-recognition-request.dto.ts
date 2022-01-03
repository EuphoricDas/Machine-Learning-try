import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImageSourceDTO } from '../face-api';

export class PanRecognitionRequestDTO {
  @ApiProperty({ type: ImageSourceDTO })
  image: ImageSourceDTO;

  @ApiPropertyOptional({ type: [String] })
  fieldsToRetrieve: string[];
}
