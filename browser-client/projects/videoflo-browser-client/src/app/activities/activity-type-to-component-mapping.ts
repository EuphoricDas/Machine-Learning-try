import { Type } from '@angular/core';
import { ActivityType } from '../models/activity-type';
import { ActivityComponent } from './activity.component';
import { CaptureImageActivityComponent } from './capture-image/capture-image-activity.component';
import { CaptureImageSummaryComponent } from './capture-image/capture-image-summary.component';
import { FaceRecognitionActivityComponent } from './face-recognition/face-recognition-activity.component';
import { FaceRecognitionSummaryComponent } from './face-recognition/face-recognition-summary.component';
import { GeolocationActivityComponent } from './geolocation/geolocation-activity.component';
import { GeolocationSummaryComponent } from './geolocation/geolocation-summary.component';
import { IpInformationActivityComponent } from './ip-information/ip-information-activity.component';
import { IpInformationSummaryComponent } from './ip-information/ip-information-summary.component';
import { ManualPromptActivityComponent } from './manual-prompt/manual-prompt-activity.component';
import { MatchHeadPoseActivityComponent } from './match-head-pose/match-head-pose-activity.component';
import { MatchHeadPoseSummaryComponent } from './match-head-pose/match-head-pose-summary.component';
import { PanRecognitionActivityComponent } from './pan-recognition/pan-recognition-activity.component';
import { PanRecognitionSummaryComponent } from './pan-recognition/pan-recognition-summary.component';
import { QnaActivitySummaryComponent } from './qna/qna-activity-summary.component';
import { QnaActivityComponent } from './qna/qna-activity.component';
import { WelcomeActivityComponent } from './welcome/welcome-activity.component';

const activityType2ComponentMapping: Map<
  string,
  Type<ActivityComponent>
> = new Map([
  [ActivityType.Welcome, WelcomeActivityComponent as Type<ActivityComponent>],
  [
    ActivityType.GeolocationVerification,
    GeolocationActivityComponent as Type<ActivityComponent>,
  ],
  [
    ActivityType.IpAddressVerification,
    IpInformationActivityComponent as Type<ActivityComponent>,
  ],
  [
    ActivityType.PanRecognition,
    PanRecognitionActivityComponent as Type<ActivityComponent>,
  ],
  [
    ActivityType.FaceRecognition,
    FaceRecognitionActivityComponent as Type<ActivityComponent>,
  ],
  [ActivityType.MatchHeadPoses, MatchHeadPoseActivityComponent as Type<any>],
  [ActivityType.QnA, QnaActivityComponent as Type<ActivityComponent>],
  [
    ActivityType.CaptureImage,
    CaptureImageActivityComponent as Type<ActivityComponent>,
  ],
  [
    ActivityType.ManualPrompt,
    ManualPromptActivityComponent as Type<ActivityComponent>,
  ],
]);

const activityType2SummaryComponentMapping: Map<string, Type<any>> = new Map([
  [
    ActivityType.GeolocationVerification,
    GeolocationSummaryComponent as Type<any>,
  ],
  [
    ActivityType.IpAddressVerification,
    IpInformationSummaryComponent as Type<any>,
  ],
  [ActivityType.PanRecognition, PanRecognitionSummaryComponent as Type<any>],
  [ActivityType.FaceRecognition, FaceRecognitionSummaryComponent as Type<any>],
  [ActivityType.MatchHeadPoses, MatchHeadPoseSummaryComponent as Type<any>],
  [ActivityType.QnA, QnaActivitySummaryComponent as Type<any>],
  [ActivityType.CaptureImage, CaptureImageSummaryComponent as Type<any>],
]);
export class ActivityTypeToComponentMapping {
  static getActivityComponent(activityType: string): Type<ActivityComponent> {
    const map = activityType2ComponentMapping;

    if (!map.has(activityType))
      throw new Error('Unsupported Activity Type! : ' + activityType);

    return map.get(activityType);
  }

  static getActivitySummaryComponent(activityType: string): Type<any> {
    const map = activityType2SummaryComponentMapping;

    if (!map.has(activityType)) return null;

    return map.get(activityType);
  }
}
