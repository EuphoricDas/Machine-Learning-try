import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';

@Component({
  selector: 'videoflo-manual-prompt-activity',
  templateUrl: './manual-prompt-activity.component.html',
  styles: [],
})
export class ManualPromptActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy
{
  constructor(activitiesService: ActivitiesService) {
    super(activitiesService);
  }

  async ngOnInit(): Promise<void> {
    super.OnInit();

    // Just submit a dummy object.
    // This activity type actually has no data to be captured.
    // The approver is only going to ask the participant to move the camera around to see something
    const participant = await this.activitiesService.getParticipant(
      null,
      null,
      this.activity.gatherFrom[0]
    );

    this.activitiesService.submitActivityDataGathered(this.activity.id, {
      gatheredFrom: participant.participantId,
      payload: {},
    });
  }

  get config() {
    return this.activity.configuration;
  }

  onRejectClicked(): void {
    this.onActivityActionForAllParticipants(false);
  }

  onNextClicked(): void {
    this.onActivityActionForAllParticipants(true);
  }

  onActivityStateChanged(state: any): void {
    // Nothing to do here
  }

  onActivityDataPublished(): void {
    // Nothing to do here
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
