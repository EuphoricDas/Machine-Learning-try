import { Component, OnInit } from '@angular/core';
import { MatchHeadPoseResultDto } from '../../api/models';
import { ActivityData } from '../../models/activity-data';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-match-head-pose-summary',
  templateUrl: './match-head-pose-summary.component.html',
  styles: [],
})
export class MatchHeadPoseSummaryComponent
  implements OnInit, ActivitySummaryItem {
  activityData: ActivityData;

  isFailed = false;
  totalPoses = 0;
  passedPoses = 0;
  failedPoses = 0;

  private __isResultProcessed = false;

  constructor() { }

  ngOnInit(): void { }

  get isResultProcessed(): boolean {
    if (this.__isResultProcessed) return true;

    const entries = Object.entries(this.activityData);

    if (entries.length > 0) {
      const finalResults = entries[0][1].payload;

      this.totalPoses = finalResults.length;

      finalResults.forEach((poseResults) => {
        const results = poseResults.result.frameResults;

        const totalItems = results.length;

        const poseMatchingItems = results.filter(
          (item) => item.result === true
        ).length;

        const matchingProportion = poseMatchingItems / totalItems;

        // If 3/4th of the poses are matching, then we are good.
        const isSuccess = matchingProportion >= 0.75;

        if (isSuccess) {
          this.passedPoses++;
        } else {
          this.failedPoses++;
        }
      });

      this.isFailed = (this.passedPoses / this.totalPoses) < 0.75;

      this.__isResultProcessed = true;

      return true;
    }
  }
}
