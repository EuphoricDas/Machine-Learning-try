import { Component, OnInit } from '@angular/core';
import { IpLookupResponseDto } from '../../api/models';
import { ActivityData } from '../../models/activity-data';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-ip-information-summary',
  templateUrl: './ip-information-summary.component.html',
  styles: [],
})
export class IpInformationSummaryComponent
  implements OnInit, ActivitySummaryItem
{
  activityData: ActivityData;

  constructor() {}

  ngOnInit(): void {}

  get ipInfo(): IpLookupResponseDto {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0) {
      return entries[0][1].payload as IpLookupResponseDto;
    }
  }

  get isThreat(): boolean {
    return this.ipInfo.threat.is_threat;
  }
}
