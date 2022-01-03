/* tslint:disable */
/* eslint-disable */
import { MatchHeadPoseResultItem } from './match-head-pose-result-item';
export interface MatchHeadPoseResponseDto {
  errorCode?: number;
  errorMessage?: string;
  results?: Array<MatchHeadPoseResultItem>;
  success: boolean;
}
