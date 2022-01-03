import { Subscription } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityData, ActivityParticipantData } from '../models/activity-data';
import { ActivitiesService } from '../services/activities.service';

export abstract class ActivityComponent {
  activity: Activity;

  activityData: ActivityData = {};

  protected activityDataPublishedSubscription: Subscription;

  protected activityStateChangedSubscription: Subscription;

  constructor(protected activitiesService: ActivitiesService) {}

  protected OnInit(): void {
    if (this.shouldDisplayResults) {
      this.activityDataPublishedSubscription =
        this.activitiesService.onActivityDataAvailable$.subscribe((payload) => {
          if (this.activity.id === payload.activityId) {
            this.activityData = {};

            Object.entries(payload.data).forEach(([participantId, data]) => {
              this.activityData[participantId] = data;
            });

            this.onActivityDataPublished();
          } else {
            alert(
              'Current workflow activity loaded does not match with the data published by the server!'
            );
          }
        });
    }

    this.activityStateChangedSubscription =
      this.activitiesService.onActivityStateChanged$.subscribe((payload) => {
        if (this.activity.id === payload.activityId) {
          this.onActivityStateChanged(payload);
        }
      });
  }

  protected OnDestroy(): void {
    if (this.activityDataPublishedSubscription) {
      this.activityDataPublishedSubscription.unsubscribe();
    }
  }

  get isGatheringData() {
    return this.activity?.gatherFrom?.includes(
      this.activitiesService.participantRole
    );
  }

  get shouldDisplayResults() {
    return this.activity?.displayTo?.includes(
      this.activitiesService.participantRole
    );
  }

  abstract onActivityStateChanged(state: any): void;

  abstract onActivityDataPublished(): void;

  isDataAvailable(participantId: string): boolean {
    return !!this.activityData[participantId];
  }

  protected onActivityActionForAllParticipants(accepted: boolean) {
    Object.entries(this.activityData).forEach(([key, value]) =>
      this.onActivityAction(accepted, key, value)
    );
  }

  protected onActivityAction(
    accepted: boolean,
    gatheredFrom: string,
    data: ActivityParticipantData
  ) {
    this.activitiesService.onActivityAction(accepted, gatheredFrom, data);
  }
}
