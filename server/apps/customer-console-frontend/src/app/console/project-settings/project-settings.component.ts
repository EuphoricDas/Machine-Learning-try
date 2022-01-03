import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkflowRole } from '../../api/models';
import { ProjectAddUpdateDto} from '../../api/models/project-add-update-dto'
import { ProjectInfoDto} from '../../api/models/project-info-dto'
import { AuthenticationService } from '../../console/shared/services/authentication.service';
import { ProjectService } from '../../api/services/project.service'
import { MessageService } from 'primeng/api';
import { ProjectUpdateInfo } from '../shared/project-update-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit {
  projectInfo: ProjectInfoDto
  projectId: number;
  createNew: boolean = false;
  participantCount: number = 0;

  constructor(
    public authService: AuthenticationService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.authService.currentUser.subscribe(async (user) => {
      if (!user) return;
      if (window.history.state.id) {
        if (!window.history.state.new) {
          this.projectId = window.history.state.id;
        }
      }
      else if (window.history.state.new) {
        let projectUpdate = {
          description: "",
          name: "",
        } as ProjectAddUpdateDto;

        this.projectId = await this.projectService.create({ body: projectUpdate }).toPromise();
        this.createNew = true;
      } else {
        this.projectId = user.mostRecentlyUsedProject;
      }

      this.projectInfo = await this.projectService.getProjectById({ id: this.projectId }).toPromise();

      if (!this.projectInfo.roles)
        this.projectInfo.roles = [];

      this.configureForm();
    });
  }

  form: FormGroup;
  roles: FormArray;
  Id: number;

  private configureForm() {
    this.roles = new FormArray([], Validators.required);

    if (this.projectInfo?.roles?.length > 0) {
      this.projectInfo.roles.map(a => {
        this.roles.push(this.createWorkflowRoleFormGroup(a));
      });
    }

    this.form = this.formBuilder.group({
      projectName: new FormControl(this.projectInfo.name, Validators.required),
      projectDescription: new FormControl(this.projectInfo.description),
      roles: this.roles
    });
  }

  get f() {
    return this.form.controls;
  }

  submitted = false;
  isSubmitting = false;

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    var workFlowInfo: ProjectUpdateInfo[] = new Array();
    var rolesArray = this.roles as FormArray;
    var len = rolesArray.length
    for (var j = 0; j < len; j++) {
      if (rolesArray.at(j).get('minNoOfParticipants').value != 0) {
        this.participantCount++;
      }
    }
    if (this.participantCount != 0) {
      for (var i = 0; i < len; i++) {
        let info: ProjectUpdateInfo = {
          name: rolesArray.at(i).get('name').value,
          minNoOfParticipants: rolesArray.at(i).get('minNoOfParticipants').value,
          callUISettings: {
            chat: rolesArray.at(i).get('chat').value,
            toolbarButtons: {
              audio: rolesArray.at(i).get('audio').value,
              exit: rolesArray.at(i).get('exit').value,
              fullScreen: rolesArray.at(i).get('fullScreen').value,
              layoutSpeaking: rolesArray.at(i).get('layoutSpeaking').value,
              screenShare: rolesArray.at(i).get('screenShare').value,
              video: rolesArray.at(i).get('video').value
            },
          }
        }
        workFlowInfo.push(info);
      }

      let projectUpdate = {
        description: this.f.projectDescription.value,
        id: this.projectId,
        name: this.f.projectName.value,
        roles: workFlowInfo,
      } as ProjectAddUpdateDto;

      this.projectService.update({ body: projectUpdate })
        .subscribe(
          result => {
            this.submitted = true;
            this.successToast();
          },
          error => {
            let msg = 'An error has occurred!';

            if (error.error.message) {
              msg = error.error.message;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: msg
            });
          });
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There must be atleast one participant in a role for the call to initiate!'
      });
    }
  }

  async onCancel(){
    await this.projectService.deleteProject({ id: this.projectId }).toPromise()
  }

  successToast() {
    if (this.createNew) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully created the project!'
      });

      this.createNew = false;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['console/project-settings'], { state: { id: this.projectId } }));
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully updated the project info!'
      });
    }

  }
  addNewRole() {
    if (!this.projectInfo) return;

    const newRole = this.createWorkflowRoleFormGroup();

    this.roles.push(newRole);
  }

  onRoleDeleted(index: number) {
    this.roles.removeAt(index);
  }

  private createWorkflowRoleFormGroup(role?: WorkflowRole) {
    if (!role) {
      role = {
        name: '',
        minNoOfParticipants: 0,
        callUISettings: {
          chat: true,
          toolbar: true,
          autoPublish: false,
          footer: true,
          toolbarButtons: {
            audio: true,
            video: true,
            fullScreen: true,
            screenShare: false,
            layoutSpeaking: false,
            exit: true
          }
        }
      };
    }

    return this.formBuilder.group({
      name: new FormControl(role.name, Validators.required),
      minNoOfParticipants: new FormControl(role.minNoOfParticipants, Validators.required),
      chat: new FormControl(role.callUISettings.chat),
      audio: new FormControl(role.callUISettings.toolbarButtons.audio),
      video: new FormControl(role.callUISettings.toolbarButtons.video),
      fullScreen: new FormControl(role.callUISettings.toolbarButtons.fullScreen),
      screenShare: new FormControl(role.callUISettings.toolbarButtons.screenShare),
      layoutSpeaking: new FormControl(role.callUISettings.toolbarButtons.layoutSpeaking),
      exit: new FormControl(role.callUISettings.toolbarButtons.exit)
    });
  }

  @ViewChild('secretKeyInput') secretKeyInput: ElementRef;
  isSecretVisible = false;

  toggleSecretDisplay() {
    const ele = this.secretKeyInput.nativeElement;

    ele.type = this.isSecretVisible ? 'password' : 'text';

    this.isSecretVisible = !this.isSecretVisible;
  }

  copyAppId() {
    if (this.projectInfo?.appId)
      this.clipboard.copy(this.projectInfo.appId);
  }

  copySecretKey() {
    if (this.projectInfo?.secretKey)
      this.clipboard.copy(this.projectInfo.secretKey);
  }
}
