import { ApiProperty } from '@nestjs/swagger';
import { FaceApiResponseDTO } from './face-api-response.dto';

export class CompareFacesResultDTO extends FaceApiResponseDTO {
  @ApiProperty()
  isMatching: boolean;

  @ApiProperty()
  distance?: number;

  @ApiProperty()
  matchingPercentage?: number;
}
