/* tslint:disable */
/* eslint-disable */
import { MatchHeadPoseResponseDto } from './match-head-pose-response-dto';
export interface MatchHeadPoseResultDto {
  pose: 'faceup' | 'facedown' | 'faceleft' | 'faceright' | 'tiltleft' | 'tiltright' | 'facestraight';
  response: MatchHeadPoseResponseDto;
}
