import { ApiProperty } from '@nestjs/swagger';
import { PoseName } from '../../services/cv-api';

export class MatchHeadPoseImageItemDTO {
  @ApiProperty()
  imageid: number;

  @ApiProperty()
  image: string;
}

export class MatchHeadPoseRequestDTO {
  @ApiProperty({
    enum: PoseName
  })
  pose: PoseName;

  @ApiProperty({
    type: [MatchHeadPoseImageItemDTO]
  })
  images: MatchHeadPoseImageItemDTO[];
}

