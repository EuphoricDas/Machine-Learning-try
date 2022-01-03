import { Component, OnInit } from '@angular/core';
import { ActivityData } from '../../models/activity-data';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-pan-recognition-summary',
  templateUrl: './pan-recognition-summary.component.html',
})
export class PanRecognitionSummaryComponent
  implements OnInit, ActivitySummaryItem
{
  activityData: ActivityData;

  constructor() {}

  ngOnInit(): void {}

  get panDetails() {
    const entries = Object.entries(this.activityData);
    if (entries.length > 0) {
      return entries[0][1]?.payload.result;
    }
  }
}
