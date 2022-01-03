import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PrecallChecklist, PrecallChecks } from '../../api/models';
import { ActivitiesService } from '../../services/activities.service';
import { Utils } from '../../shared/utils';

@Component({
  selector: 'videoflo-precall-checks',
  templateUrl: './precall-checks.component.html',
  styleUrls: ['./precall-checks.component.css']
})
export class PrecallChecksComponent implements OnInit {
  @Input() precallChecks: PrecallChecks;

  consentCompleted = false;

  devicePermissionsCompleted = false;

  currentChecklist: PrecallChecklist;

  allChecklistsCompleted = false;

  @Output() precallChecksCompleted = new EventEmitter<any>();

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    if (!this.precallChecks.consent) {
      this.consentCompleted = true;
    }
  }

  onConsentAcquired() {
    this.consentCompleted = true;
    this.activitiesService.consentAcquired({
      consentTimestamp: new Date()
    });
  }

  async onPermissionsAcquired(data) {
    this.devicePermissionsCompleted = true;

    this.activitiesService.permissionsAcquired(data);

    await this.showCustomCheckLists();
  }

  async onCustomChecklistCompleted(checklistInfo: { checklistId: string; timestamp: Date }) {
    this.activitiesService.precallCustomChecklistCompleted(checklistInfo);

    await this.showCustomCheckLists();
  }

  private async showCustomCheckLists() {
    if (this.precallChecks?.checklist?.length > 0) {
      this.currentChecklist = { id: '' };

      await Utils.delay(50);

      this.currentChecklist = this.precallChecks.checklist.shift();
    } else {
      this.allChecklistsCompleted = true;

      this.activitiesService.precallChecksCompleted();

      this.precallChecksCompleted.emit();
    }
  }
}
