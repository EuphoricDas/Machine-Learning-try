import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PrimeNgModule } from './../primeng.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { AuthGuard } from './shared/auth.guard';
import { ContentComponent } from './shared/content/content.component';
import { FooterComponent } from './shared/footer/footer.component';
import { JwtInterceptor } from './shared/interceptors/jwt-interceptor';
import { UpdateDateHttpInterceptor } from './shared/interceptors/update-date-interceptor';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { TopNavComponent } from './shared/top-nav/top-nav.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { WorkflowRoleEditorComponent } from './project-settings/workflow-role-editor.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/console/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'project-settings', component: ProjectSettingsComponent, canActivate: [AuthGuard] },
  { path: 'project-list', component: ProjectsListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    ContentComponent,
    FooterComponent,
    SideBarComponent,
    TopNavComponent,
    UserProfileComponent,
    LoginComponent,
    DashboardComponent,
    ProjectSettingsComponent,
    WorkflowRoleEditorComponent,
    ProjectsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    PrimeNgModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UpdateDateHttpInterceptor, multi: true }
  ]
})
export class ConsoleModule { }
