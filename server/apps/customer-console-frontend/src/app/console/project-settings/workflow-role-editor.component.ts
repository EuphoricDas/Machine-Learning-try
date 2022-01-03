import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-workflow-role-editor",
  templateUrl: "./workflow-role-editor.component.html",
})
export class WorkflowRoleEditorComponent implements OnInit {
  constructor() {}

  @Input("roleFormGroup")
  roleFormGroup: any;

  @Input("submitted")
  submitted: boolean = false;

  ngOnInit(): void {
  }

  get f() {
    return this.roleFormGroup?.controls;
  }
}
