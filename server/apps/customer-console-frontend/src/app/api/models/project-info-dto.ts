/* tslint:disable */
/* eslint-disable */
import { UserRole } from '../../console/shared/user-role';
import { WorkflowRole } from './workflow-role';
export interface ProjectInfoDto {
  appId: string;
  description: string;
  id: number;
  loggedUserRole: UserRole;
  name: string;
  roles: Array<WorkflowRole>;
  secretKey: string;
  userCount: number;
}
