import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';
import { ImageCaptureResult } from '../image-capture/image-capture-result';
import { ImageCaptureComponent } from '../image-capture/image-capture.component';

@Component({
  selector: 'videoflo-capture-image-activity',
  templateUrl: './capture-image-activity.component.html',
  styles: [],
})
export class CaptureImageActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy {
  imageCaptureCompleted = false;
  capturedImage: ImageCaptureResult;

  @ViewChild('imageCapture') private imageCapture: ImageCaptureComponent;

  constructor(activitiesService: ActivitiesService) {
    super(activitiesService);
  }

  ngOnInit(): void {
    super.OnInit();
  }

  get config(): any {
    return this.activity.configuration;
  }

  onBeginImageCapture() { }

  onImageCaptured(result: ImageCaptureResult) {
    this.capturedImage = result;
    this.imageCaptureCompleted = true;

    this.submitCapturedImageData(
      this.imageCapture.imageProvidingUser.data.id,
      this.capturedImage
    );
  }

  private submitCapturedImageData(
    submittingParticipantId: string,
    data: ImageCaptureResult
  ): void {
    if (this.capturedImage?.base64Image) {
      this.activitiesService.submitActivityDataGathered(
        this.activity.id,
        {
          gatheredFrom: submittingParticipantId,
          payload: {
            base64Image: data.base64Image
          },
        },
        this.config.responseRequired
      );
    }
  }

  onActivityStateChanged(state: any): void {
    // Nothing to do here
  }

  onActivityDataPublished(): void {
    // Nothing to do here
  }

  onRejectClicked(): void {
    this.onActivityActionForAllParticipants(false);
  }

  onNextClicked(): void {
    this.onActivityActionForAllParticipants(true);
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
