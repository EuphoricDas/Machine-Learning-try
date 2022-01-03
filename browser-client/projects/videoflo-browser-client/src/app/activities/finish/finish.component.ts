import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { WorkflowData } from '../../models/activity-data';
import { ActivityType } from '../../models/activity-type';
import { ActivitiesService } from '../../services/activities.service';
import { DynamicComponentHostDirective } from '../../shared/dynamic-component-host.directive';
import { ActivitySummaryItem } from '../activity-summary-item';
import { ActivityTypeToComponentMapping } from '../activity-type-to-component-mapping';

@Component({
  selector: 'videoflo-finish',
  templateUrl: './finish.component.html'
})
export class FinishComponent implements OnInit {
  @Input() workflowData: WorkflowData;

  @Output() workflowEnded = new EventEmitter<any>();

  @ViewChild(DynamicComponentHostDirective, { static: true })
  workflowSummaryHost: DynamicComponentHostDirective;

  constructor(private activitiesService: ActivitiesService, private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    const viewContainerRef = this.workflowSummaryHost.viewContainerRef;

    viewContainerRef.clear();

    console.log(this.workflowData);

    Object.entries(this.workflowData).forEach(([activityId, data]) => {
      const activityType = this.activitiesService.activities.find((a) => a.activityId === activityId).activityType;

      const type = ActivityType[activityType];

      const activitySummaryComponent = ActivityTypeToComponentMapping.getActivitySummaryComponent(type);

      if (activitySummaryComponent) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(activitySummaryComponent);

        const componentRef = viewContainerRef.createComponent<any>(componentFactory);

        (<ActivitySummaryItem>componentRef.instance).activityData = data;
      }
    });
  }

  get isAgent() {
    return this.activitiesService.participantRole === 'agent';
  }

  onReject() {
    this.activitiesService.finishWorkflow(false);

    this.workflowEnded.emit();
  }

  onAccept() {
    this.activitiesService.finishWorkflow(true);

    this.workflowEnded.emit();
  }
}
