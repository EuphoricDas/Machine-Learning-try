import { Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { WorkflowData } from '../../models/activity-data';
import { ActivityItem } from '../../models/activity-item';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityResult } from '../../services/activity-result';
import { DynamicComponentHostDirective } from '../../shared/dynamic-component-host.directive';
import { ModalDialogComponent } from '../../shared/modal-dialog/modal-dialog.component';
import { ActivityTypeToComponentMapping } from '../activity-type-to-component-mapping';
import { ActivityComponent } from '../activity.component';

declare type Unsubscribable = Subscription | Subject<any>;

@Component({
  selector: 'videoflo-workflow-activities-container',
  templateUrl: './activities-container.component.html',
  styleUrls: ['./activities-container.component.css']
})
export class ActivitiesContainerComponent implements OnInit, OnDestroy {
  @Input() lightTheme: boolean;

  @ViewChild(DynamicComponentHostDirective, { static: true })
  activityHost: DynamicComponentHostDirective;

  @Output() workflowEnded = new EventEmitter<ActivityResult>();

  isActivitiesExhausted = false;

  currentActivityItem: ActivityItem;
  currentActivityComponentInstance: ActivityComponent;

  private subscriptions: Unsubscribable[] = [];

  workflowData: WorkflowData;

  private dialogRef: any;

  constructor(
    private activitiesService: ActivitiesService,
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.activitiesService.attainedQuorum$.subscribe(() => {
        this.closeDialog();
      })
    );

    this.subscriptions.push(
      this.activitiesService.noQuorum$.subscribe(() => {
        this.showNoQuorumDialog();
      })
    );

    this.subscriptions.push(this.activitiesService.beginActivity$.subscribe((workflowItem) => this.loadComponent(workflowItem)));

    this.subscriptions.push(this.activitiesService.activitiesExhausted$.subscribe((data) => this.onActivitiesExhausted(data)));

    this.subscriptions.push(this.activitiesService.workflowFinished$.subscribe((resultState) => this.onWorkflowEnded(resultState)));

    this.activitiesService.initializeActivities();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.activitiesService.ngOnDestroy();
  }

  private loadComponent(activityItem: ActivityItem): void {
    this.currentActivityComponentInstance = null;

    this.currentActivityItem = activityItem;

    const activityType = activityItem.activity.activityType;

    const activityComponent = ActivityTypeToComponentMapping.getActivityComponent(activityType);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(activityComponent);

    const viewContainerRef = this.activityHost.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(componentFactory);

    const instance = componentRef.instance;

    instance.activity = activityItem.activity;

    if (activityItem.data) {
      instance.data = activityItem.data;
    }

    this.currentActivityComponentInstance = instance;
  }

  private onActivitiesExhausted(data: WorkflowData) {
    this.workflowData = data;
    this.isActivitiesExhausted = true;
    this.activityHost.viewContainerRef.clear();
  }

  onWorkflowEnded(resultState: ActivityResult) {
    this.activityHost.viewContainerRef.clear();

    this.workflowEnded.emit(resultState);
  }

  showNoQuorumDialog() {
    const header = 'Waiting for other Participants to join';
    const message = 'One or more required participants have not yet joined or have been disconnected. Please wait for them to join.';

    this.dialogRef = this.dialog.open(ModalDialogComponent, {
      data: { header, message },
      disableClose: true,
      hasBackdrop: true
    });
  }

  closeDialog() {
    this.dialogRef?.close();
  }
}
