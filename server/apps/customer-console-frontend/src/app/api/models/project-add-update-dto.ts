/* tslint:disable */
/* eslint-disable */
import { WorkflowRole } from './workflow-role';
export interface ProjectAddUpdateDto {
  description: string;
  id: number;
  name: string;
  roles: Array<WorkflowRole>;
}
