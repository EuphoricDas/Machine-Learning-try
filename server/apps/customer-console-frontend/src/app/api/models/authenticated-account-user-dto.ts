/* tslint:disable */
/* eslint-disable */
import { ProjectDto } from './project-dto';
export interface AuthenticatedAccountUserDto {
  accountId: number;
  accountName: string;
  id: number;
  mostRecentlyUsedProject: number;
  name: string;
  projects: Array<ProjectDto>;
  role: 'customerAdmin' | 'customerDeveloper' | 'customerBiller';
  token: string;
}
