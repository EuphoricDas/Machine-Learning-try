export class WorkflowData {
  [activityId: string]: ActivityData;
}

export class ActivityData {
  [gatheredFrom: string]: ActivityParticipantData;
}

export class ActivityParticipantData {
  payload?: any;
  gatheredFrom: string;
  accepted?: boolean;
  acceptedBy?: string;
  rejectedBy?: string;
}

export type ActivityPublishedData = {
  activityId: string;
  activityType: string;
  data: ActivityData;
};
