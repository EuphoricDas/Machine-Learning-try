import { Component, OnInit } from '@angular/core';
import { GeocodingResultDto } from '../../api/models';
import { ActivityData } from '../../models/activity-data';
import { ActivitySummaryItem } from '../activity-summary-item';

@Component({
  selector: 'videoflo-geolocation-summary',
  templateUrl: './geolocation-summary.component.html',
  styles: [],
})
export class GeolocationSummaryComponent
  implements OnInit, ActivitySummaryItem
{
  activityData: ActivityData;

  constructor() {}

  ngOnInit(): void {}

  private get result(): any {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0) {
      return entries[0][1].payload;
    }
  }

  get geoCodingResult(): GeocodingResultDto {
    const result = this.result;
    if (result) {
      return result.results[0] as GeocodingResultDto;
    }
  }

  get accuracy() {
    const result = this.result;
    if (result) {
      return result?.accuracy;
    }
  }
}
