import { ApiProperty } from '@nestjs/swagger';
import { PoseName } from '../../services/cv-api';
import { MatchHeadPoseResponseDTO } from './match-head-pose-response.dto';

export class MatchHeadPoseResultDTO {
  @ApiProperty({
    enum: PoseName
  })
  pose: PoseName;

  @ApiProperty({
    type: MatchHeadPoseResponseDTO
  })
  response: MatchHeadPoseResponseDTO;
}
