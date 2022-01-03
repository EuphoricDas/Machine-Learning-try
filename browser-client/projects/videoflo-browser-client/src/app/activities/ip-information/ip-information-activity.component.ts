import { Component, OnDestroy, OnInit } from '@angular/core';
import { IpLookupResponseDto } from '../../api/models';
import { ClientApiService } from '../../api/services/client-api.service';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';

@Component({
  selector: 'videoflo-ip-information-activity',
  templateUrl: './ip-information-activity.component.html',
})
export class IpInformationActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy
{
  ipInfo: IpLookupResponseDto;

  isIpInfoFetched = false;

  constructor(
    private clientApiService: ClientApiService,
    activitiesService: ActivitiesService
  ) {
    super(activitiesService);
  }

  async ngOnInit(): Promise<void> {
    super.OnInit();

    if (
      this.isGatheringData &&
      !this.isDataAvailable(this.activitiesService.participantId)
    ) {
      this.ipInfo = await this.clientApiService
        .getCustomerIpInfo()
        .toPromise();
      this.isIpInfoFetched = true;
      this.activitiesService.submitActivityDataGathered(this.activity.id, {
        gatheredFrom: this.activitiesService.participantId,
        payload: this.ipInfo,
      });
    } else {
      this.onActivityDataPublished();
    }
  }

  onNextClicked() {
    this.onActivityActionForAllParticipants(true);
  }

  onRejectClicked() {
    this.onActivityActionForAllParticipants(false);
  }

  onActivityStateChanged(payload: any): void {}

  onActivityDataPublished(): void {
    const entries = Object.entries(this.activityData);

    if (this.shouldDisplayResults && entries.length > 0) {
      this.ipInfo = entries[0][1].payload;

      if (this.ipInfo) this.isIpInfoFetched = true;
    }
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
