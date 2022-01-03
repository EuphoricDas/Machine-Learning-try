import { Component, OnDestroy, OnInit, Type, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PanRecognitionResponseDto } from '../../api/models';
import { ClientApiService } from '../../api/services/client-api.service';
import { PanRecognitionActivityConfiguration } from '../../models/pan-recognition-acitivity-congifuration';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';
import { ImageCaptureResult } from '../image-capture/image-capture-result';
import { ImageCaptureComponent } from '../image-capture/image-capture.component';
import { ImageDialogData, ShowImageComponent } from '../image-capture/show-image-dialog/show-image.component';

@Component({
  selector: 'videoflo-pan-recognition-activity',
  templateUrl: './pan-recognition-activity.component.html',
})
export class PanRecognitionActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy
{
  @ViewChild('panImageCapture') private panImageCapture: ImageCaptureComponent;

  isPanCaptured = false;

  panCaptured = false;

  panImage: ImageCaptureResult;

  panRecognitionCompleted = false;

  recognizing = false;

  isReadyToProcess = false;

  panRecognitionResult: PanRecognitionResponseDto;

  constructor(
    protected activitiesService: ActivitiesService,
    private clientApiService: ClientApiService,
    public dialog: MatDialog
  ) {
    super(activitiesService);
  }

  ngOnInit(): void {
    super.OnInit();
  }

  get config(): PanRecognitionActivityConfiguration {
    return this.activity.configuration as PanRecognitionActivityConfiguration;
  }

  onPanImageCapture(): void {
    this.isPanCaptured = true;
    this.panCaptured = false;
    this.isReadyToProcess = true;
    this.panImage = null;
    this.resetPanRecognitionState();
  }

  onPanImageCaptured(imageCaptureResult: ImageCaptureResult): void {
    this.isPanCaptured = false;
    this.panCaptured = true;
    this.isReadyToProcess = true;

    this.panImage = imageCaptureResult;

    if (this.panImage?.base64Image) this.processPanImage();
  }

  private submitPanRecognizedData(
    submittingParticipantId: string,
    data: any
  ): void {
    if (this.panImage?.base64Image) {
      this.activitiesService.submitActivityDataGathered(
        this.activity.id,
        {
          gatheredFrom: submittingParticipantId,
          payload: {
            image: this.panImage.base64Image,
            result: data,
          },
        },
        this.config.responseRequired
      );
    }
  }

  private resetPanRecognitionState(): void {}

  onRejectClicked(): void {
    this.onActivityActionForAllParticipants(false);
  }

  onNextClicked(): void {
    this.onActivityActionForAllParticipants(true);
  }

  onActivityStateChanged(payload: any): void {}

  onActivityDataPublished(): void {
    if (this.shouldDisplayResults && !this.panRecognitionCompleted) {
      const gatheredFrom = this.panImageCapture.imageProvidingUser.data.id;

      const payload = this.activityData[gatheredFrom]?.payload;

      if (payload.panImage) {
        this.panCaptured = true;
        this.panImage = payload.image;
        this.panImageCapture.image = this.panImage;
      }
    }
  }

  async processPanImage() {
    this.recognizing = true;
    this.panRecognitionCompleted = false;

    this.panRecognitionResult = await this.clientApiService
      .panRecognition({
        body: {
          image: {
            base64Image: this.panImage.base64Image,
          },
          fieldsToRetrieve: this.config.requiredFields.concat(
            this.config.optionalFields
          ),
        },
      })
      .toPromise();
    this.recognizing = false;
    this.panRecognitionCompleted = true;
    this.submitPanRecognizedData(
      this.panImageCapture.imageProvidingUser.data.id,
      this.panRecognitionResult
    );
  }

  showImageDialog(image: string, caption: string) {
    const dialogRef = this.dialog.open(ShowImageComponent, {
      data: <ImageDialogData>{
        image, caption
      }
    });

    dialogRef.afterClosed().subscribe((r) => {
      console.log(`Dialog result: ${r}`);
    });
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
