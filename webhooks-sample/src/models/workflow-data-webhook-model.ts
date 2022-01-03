import { WorkflowStepData } from './workflow-step-data';

export interface WorkflowDataWebhookModel {
  accepted: boolean;
  data: {
    [stepType: string]: {
      [gatheredFrom: string]: WorkflowStepData;
    };
  };
}
