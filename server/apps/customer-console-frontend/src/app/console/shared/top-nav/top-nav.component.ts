import { UpdateMru } from '../../../api/models/update-mru';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { AuthenticatedAccountUserDto } from '../../../api/models/authenticated-account-user-dto'
import { ProjectDto } from '../../../api/models/project-dto'
import { AccountService } from '../../../api/services';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent implements OnInit {
  loggedInUser: AuthenticatedAccountUserDto;
  projects: ProjectDto[] = [];
  currentProject: ProjectDto 
  constructor(
    private router: Router,
    public authService: AuthenticationService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
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
        this.router.navigate(['console/project-settings'], { state: { id: projectId } }));
    } else {
      this.router.navigate(['console/project-settings'], { state: { id: projectId } });
    }
  }
}
