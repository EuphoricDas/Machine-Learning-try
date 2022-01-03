/* tslint:disable */
/* eslint-disable */
import { MatchHeadPoseImageItemDto } from './match-head-pose-image-item-dto';
export interface MatchHeadPoseRequestDto {
  images: Array<MatchHeadPoseImageItemDto>;
  pose: 'faceup' | 'facedown' | 'faceleft' | 'faceright' | 'tiltleft' | 'tiltright' | 'facestraight';
}
