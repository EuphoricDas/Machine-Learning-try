import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { PrecallChecklist } from '../../../api/models';

@Component({
  selector: 'videoflo-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {
  @Input() checklistConfig: PrecallChecklist;

  @Output() onChecklistCompleted = new EventEmitter<any>();

  hasCheckListItems = false;

  constructor() {}

  ngOnInit(): void {
    this.hasCheckListItems = this.checklistConfig?.items?.length > 0;
  }

  onContinueClick() {
    this.onChecklistCompleted.emit({
      checklistId: this.checklistConfig.id,
      timestamp: new Date()
    });
  }
}
