import { ActivityData } from '.';

export class WorkflowData {
  [activityId: string]: ActivityData;

  constructor(initialValues?: Partial<WorkflowData>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
