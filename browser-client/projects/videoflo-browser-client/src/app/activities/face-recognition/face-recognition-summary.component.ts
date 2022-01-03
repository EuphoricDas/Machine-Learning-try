import { Component, OnInit } from '@angular/core';
import { ActivityData } from '../../models/activity-data';
import { FaceRecognitionData } from '../../models/face-recognition-data';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-face-recognition-summary',
  templateUrl: './face-recognition-summary.component.html',
})
export class FaceRecognitionSummaryComponent
  implements OnInit, ActivitySummaryItem
{
  activityData: ActivityData;

  constructor() {}

  ngOnInit(): void {}

  get faceRecognitionInfo(): FaceRecognitionData {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0)
      return entries[0][1]?.payload as FaceRecognitionData;
  }
}
