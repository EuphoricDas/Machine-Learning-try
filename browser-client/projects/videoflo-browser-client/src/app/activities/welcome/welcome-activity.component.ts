import { Component } from '@angular/core';
import { ActivityParticipantData } from '../../models/activity-data';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';

@Component({
  selector: 'videoflo-welcome-activity',
  templateUrl: './welcome-activity.component.html',
  styles: [],
})
export class WelcomeActivityComponent extends ActivityComponent {
  constructor(activitiesService: ActivitiesService) {
    super(activitiesService);

    this.activityData[this.activitiesService.participantId] =
      new ActivityParticipantData();
  }

  get showWelcome(): boolean {
    return this.isGatheringData;
  }

  get title(): string {
    if (this.showWelcome) return this.activity.configuration.title;

    return '<b>Please wait...</b>';
  }

  get description(): string {
    if (this.showWelcome) return this.activity.configuration.description;

    return 'Waiting for Welcome activity to be completed';
  }

  onNextClicked(): void {
    this.onActivityActionForAllParticipants(true);
  }

  onActivityStateChanged(payload: any): void {}

  onActivityDataPublished(): void {
    if (this.shouldDisplayResults) {
      this.onActivityActionForAllParticipants(true);
    }
  }
}
