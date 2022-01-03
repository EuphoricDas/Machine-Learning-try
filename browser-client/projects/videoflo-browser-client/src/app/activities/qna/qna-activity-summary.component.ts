import { Component, OnInit } from '@angular/core';
import { ActivityData } from '../../models/activity-data';
import { QnAResponse } from '../../models/qna-configuration';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-qna-activity-summary',
  templateUrl: './qna-activity-summary.component.html',
  styles: [],
})
export class QnaActivitySummaryComponent
  implements OnInit, ActivitySummaryItem
{
  constructor() {}

  activityData: ActivityData;
  qnaResponses: QnAResponse[] = [];

  ngOnInit(): void {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0) {
      this.qnaResponses = entries[0][1]?.payload as QnAResponse[];
    }
  }

  get totalAnswers(): number {
    return this.qnaResponses?.length;
  }

  get correctAnswers(): number {
    return this.qnaResponses?.filter((r) => r.isAnswerCorrect).length;
  }

  get incorrectAnswers(): number {
    return this.qnaResponses?.filter((r) => !r.isAnswerCorrect).length;
  }
}
