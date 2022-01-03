export interface WorkflowStepDataWebhookModel {
  sessionId: string;
  stepType: string;
  data: WorkflowStepData;
}

export interface WorkflowStepData {
  gatheredFrom: string;
  payload?: any;
  accepted?: boolean;
  acceptedBy?: string;
  rejectedBy?: string;
}
