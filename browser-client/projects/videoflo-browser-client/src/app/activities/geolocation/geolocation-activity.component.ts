import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeocodingResultDto, GeocodingResultsDto } from '../../api/models';
import { ClientApiService } from '../../api/services/client-api.service';
import { LoggerService } from '../../openvidu/services/logger/logger.service';
import { ILogger } from '../../openvidu/types/logger-type';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';

@Component({
  selector: 'videoflo-geolocation-activity',
  templateUrl: './geolocation-activity.component.html',
})
export class GeolocationActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy
{
  private log: ILogger;

  isLocationFetched = false;

  geoCodingResults: GeocodingResultsDto;

  constructor(
    activitiesService: ActivitiesService,
    private clientApiService: ClientApiService,
    private loggerSrv: LoggerService
  ) {
    super(activitiesService);
    this.log = this.loggerSrv.get('GeolocationActivityComponent');
  }

  async ngOnInit() {
    super.OnInit();

    if (this.isGatheringData) {
      setTimeout(() => this.getRemoteUserLocation(), 1000);
    } else {
      if (Object.entries(this.activityData).length > 0) {
        this.onActivityDataPublished();
      }
    }
  }

  async getRemoteUserLocation() {
    navigator.geolocation.getCurrentPosition(
      async (resp) => {
        this.geoCodingResults = await this.clientApiService
          .getGeocodeLocation({
            body: {
              latitude: resp.coords.latitude,
              longitude: resp.coords.longitude,
              accuracy: resp.coords.accuracy,
            },
          })
          .toPromise();

        this.isLocationFetched = true;
        this.activitiesService.submitActivityDataGathered(this.activity.id, {
          gatheredFrom: this.activitiesService.participantId,
          payload: this.geoCodingResults,
        });
      },
      (err) => {
        alert(
          `Error retrieving Geo Location!\n\rError Details: ${err.message}\n\r\n\rWill try again after 1 second.`
        );

        setTimeout(() => this.getRemoteUserLocation(), 1000);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  }

  onRejectClicked() {
    this.onActivityActionForAllParticipants(false);
  }

  onNextClicked() {
    this.onActivityActionForAllParticipants(true);
  }

  onActivityStateChanged(payload: any): void {}

  onActivityDataPublished(): void {
    const entries = Object.entries(this.activityData);

    if (entries.length > 0) {
      this.geoCodingResults = entries[0][1]?.payload;

      if (this.geoCodingResults) this.isLocationFetched = true;
    }
  }

  get geoCodingResult(): GeocodingResultDto {
    if (this.geoCodingResults?.results?.length > 0)
      return this.geoCodingResults?.results[0];
  }

  get accuracy() {
    return this.geoCodingResults?.accuracy;
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
