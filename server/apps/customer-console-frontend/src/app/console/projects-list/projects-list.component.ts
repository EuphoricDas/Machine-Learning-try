import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { AuthenticatedAccountUserDto } from '../../api/models/authenticated-account-user-dto'
import { ProjectDto } from '../../api/models/project-dto'
import { ProjectService } from '../../api/services/project.service';
import { AppUtils } from '../shared/app-utils';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ConfirmationService, MessageService, Message } from 'primeng/api';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  loggedInUser: AuthenticatedAccountUserDto;
  projects: ProjectDto[] = [];
  currentProject: ProjectDto ;
  cols: any[];
  loading = true;
  totalRecords: number = 0;

  getNavigationPropertyData = (data: any, column: any) =>
    AppUtils.getNavigationPropertyData(data, column)

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private projectService: ProjectService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,) { }

  async ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (!user) return;
      debugger;
      this.loggedInUser = user;
      this.projects = user.projects.filter(p => p.id != user.mostRecentlyUsedProject);
      this.currentProject = user.projects.find((p) => p.id === user.mostRecentlyUsedProject);
    });
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Name' }
    ];
  }

  loadProjects(event: LazyLoadEvent) {
    this.loading = true;
    const args = AppUtils.convertToLazyLoadArgs(event);
    this.projectService.getAllProjects({body:args}).subscribe(result => {
      this.projects = result.rows
      this.totalRecords = result.totalRows;
      this.loading = false;
    });
  }
  newProject() {
    this.router.navigate(['console/project-settings'], { state: { new: true } });
  }

  changeProject(projectId: number) {
    this.router.navigate(['console/project-settings'], { state: { id: projectId, new: false } });
  }

  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this project?',
      header: 'Sure to delete ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(id);
      },
      reject: () => {
      }
    });
  }
  deleteProject(ProjectId: number) {
    this.projectService.deleteProject({ id: ProjectId }).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project deleted successfully',
          closable: true,
          sticky: false
        });
        this.projects = this.projects.filter((p) => {
          return p.id !== ProjectId;
        });
      },
      error => {
        this.handleErrorResponse(error);
      }
    );
  }
  handleErrorResponse(errorResponse: any) {
    let msg = 'An error has occurred!';
    if (errorResponse.error.message) {
      msg = errorResponse.error.message;
    } else if (errorResponse.error) {
      msg = errorResponse.error;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: msg
    });
  }
}
