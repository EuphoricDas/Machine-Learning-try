import { ActivityParticipantData } from ".";

export class ActivityData {
  [gatheredFrom: string]: ActivityParticipantData;

  constructor(initialValues?: Partial<ActivityData>) {
    if (initialValues)
      Object.assign(this, initialValues);
  }
}
