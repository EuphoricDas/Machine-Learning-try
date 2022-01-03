//import { AuthenticatedCustomerUser } from './../../../api/models/authenticated-customer-user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { ProjectViewModel } from '../../../api/models';
import { AuthenticationService } from '../services/authentication.service';
import { AccountService } from '../../../api/services';
import { AuthenticatedAccountUserDto } from '../../../api/models/authenticated-account-user-dto'
import { ProjectDto } from '../../../api/models/project-dto'
import { UpdateMru } from '../../../api/models/update-mru'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  loggedInUser: AuthenticatedAccountUserDto;
  projects: ProjectDto[] = [];
  allProjects: ProjectDto[] = [];
  currentProject: ProjectDto 

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private accountService: AccountService
  ) { }

  async ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (!user) return;
      this.loggedInUser = user;
      this.projects = user.projects.filter(p => p.id != user.mostRecentlyUsedProject);
      this.currentProject = user.projects.find((p) => p.id === user.mostRecentlyUsedProject);
    });
  }

  logout() {
    this.authService.logout(this.router);
  }

  async changeProject(projectId: number) {
    this.loggedInUser.mostRecentlyUsedProject = projectId;
    localStorage.setItem('currentUser', JSON.stringify(this.loggedInUser));

    const data:UpdateMru = {
      accId: this.loggedInUser.accountId,
      projectId: projectId
    }

    await this.accountService.updateMru({ body:data }).toPromise();
    if (this.router.url == "/console/project-settings") {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['console/project-settings'], { state: { id: projectId, new: false } }));
    } else {
      this.router.navigate(['console/project-settings'], { state: { id: projectId, new: false } });
    }
  }
}
