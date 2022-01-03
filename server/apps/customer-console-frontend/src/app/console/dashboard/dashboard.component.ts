import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../../console/shared/user-role'
import { ProjectInfoDto } from '../../api/models/project-info-dto';
import { ProjectService } from '../../api/services/project.service';
import { AuthenticationService } from '../../console/shared/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  projectInfo: ProjectInfoDto
  curUserRole: string = '';

  constructor(
    public authService: AuthenticationService,
    private projectService: ProjectService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) return;
      const projectId = user.mostRecentlyUsedProject;

      this.projectInfo = await this.projectService.getProjectById({ id: projectId }).toPromise();

      if (this.projectInfo.loggedUserRole === UserRole.CustomerAdmin) {
        this.curUserRole = 'Owner';
      } else if (this.projectInfo.loggedUserRole === UserRole.CustomerDeveloper) {
        this.curUserRole = 'Developer';
      } else if (this.projectInfo.loggedUserRole === UserRole.CustomerBiller) {
        this.curUserRole = 'Biller';
      }
    });
  }

  changeProject(projectId: number) {
    this.router.navigate(['console/project-settings'], { state: { id: projectId, new: false } });
  }
}
