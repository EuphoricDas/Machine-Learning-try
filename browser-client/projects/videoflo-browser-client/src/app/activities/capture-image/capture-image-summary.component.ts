import { Component, OnInit } from '@angular/core';
import { ActivityData } from '../../models/activity-data';
import { ActivitySummaryItem } from '../activity-summary-item';
import { ImageCaptureResult } from '../image-capture/image-capture-result';

@Component({
  selector: 'videoflo-capture-image-summary',
  templateUrl: './capture-image-summary.component.html',
  styles: [],
})
export class CaptureImageSummaryComponent
  implements OnInit, ActivitySummaryItem
{
  constructor() {}

  activityData: ActivityData;

  ngOnInit(): void {}

  get capturedImage(): ImageCaptureResult {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0)
      return entries[0][1]?.payload?.result as ImageCaptureResult;
  }
}
