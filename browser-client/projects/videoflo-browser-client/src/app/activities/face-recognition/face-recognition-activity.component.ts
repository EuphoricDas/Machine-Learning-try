import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompareFacesResultDto } from '../../api/models';
import { ClientApiService } from '../../api/services/client-api.service';
import { environment } from '../../environments/environment';
import { FaceRecognitionActivityConfiguration } from '../../models/face-recognition-activity-configuration';
import { LoggerService } from '../../openvidu/services/logger/logger.service';
import { ILogger } from '../../openvidu/types/logger-type';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityComponent } from '../activity.component';
import { ImageCaptureResult } from '../image-capture/image-capture-result';
import { ImageCaptureComponent } from '../image-capture/image-capture.component';

@Component({
  selector: 'videoflo-face-recognition-activity',
  templateUrl: './face-recognition-activity.component.html',
  styleUrls: ['./face-recognition-activity.component.css']
})
export class FaceRecognitionActivityComponent extends ActivityComponent implements OnInit, OnDestroy {
  @ViewChild('imageCapture1') private imageCapture1: ImageCaptureComponent;
  @ViewChild('imageCapture2') private imageCapture2: ImageCaptureComponent;

  private log: ILogger;

  isCapturingFace1 = false;
  isCapturingFace2 = false;

  face1Captured = false;
  face2Captured = false;

  faceImage1: ImageCaptureResult;
  faceImage2: ImageCaptureResult;

  isReadyForCompare = false;
  comparing = false;

  compareFacesCompleted = false;

  faceMatchingResult: CompareFacesResultDto;

  production = environment.production;

  error: any;

  constructor(
    protected activitiesService: ActivitiesService,
    private clientApiService: ClientApiService,
    private loggerService: LoggerService
  ) {
    super(activitiesService);

    this.log = this.loggerService.get(FaceRecognitionActivityComponent.name);
  }

  ngOnInit(): void {
    super.OnInit();
  }

  get config(): FaceRecognitionActivityConfiguration {
    return this.activity.configuration as FaceRecognitionActivityConfiguration;
  }

  onFace1BeginCapture(): void {
    this.isCapturingFace1 = true;
    this.face1Captured = false;
    this.faceImage1 = null;
    this.resetFaceMatchingState();
    this.submitCapturedFaceImages(this.imageCapture1.imageProvidingUser.data.id);
  }

  onFace1Captured(imageCaptureResult: ImageCaptureResult): void {
    this.isCapturingFace1 = false;
    this.face1Captured = true;
    this.faceImage1 = imageCaptureResult;

    this.submitCapturedFaceImages(this.imageCapture1.imageProvidingUser.data.id);
  }

  async onFace2BeginCapture(): Promise<void> {
    this.isCapturingFace2 = true;
    this.face2Captured = false;
    this.faceImage2 = null;
    this.resetFaceMatchingState();
    this.submitCapturedFaceImages(this.imageCapture1.imageProvidingUser.data.id);

    await this.compareFaces();
  }

  async onFace2Captured(imageCaptureResult: ImageCaptureResult): Promise<void> {
    this.isCapturingFace2 = false;
    this.face2Captured = true;
    this.faceImage2 = imageCaptureResult;

    this.submitCapturedFaceImages(this.imageCapture2.imageProvidingUser.data.id);

    await this.compareFaces();
  }

  private submitCapturedFaceImages(submittingParticipantId: string): void {
    this.isReadyForCompare = this.face1Captured && this.face2Captured;

    if (this.faceImage1 || this.faceImage2) {
      this.activitiesService.submitActivityDataGathered(this.activity.id, {
        gatheredFrom: submittingParticipantId,
        payload: {
          image1: this.faceImage1,
          image2: this.faceImage2,
          faceMatchingResult: null
        }
      });
    }
  }

  private resetFaceMatchingState(): void {
    this.compareFacesCompleted = false;
    this.comparing = false;
    this.isReadyForCompare = false;
    this.faceMatchingResult = null;
  }

  async compareFaces(): Promise<void> {
    if (!this.isReadyForCompare || this.comparing) {
      return;
    }

    this.comparing = true;
    this.compareFacesCompleted = false;
    this.faceMatchingResult = null;

    try {
      this.faceMatchingResult = await this.clientApiService
        .compareFaces({
          body: {
            image1: {
              base64Image: this.faceImage1.base64Image,
              imageUrl: this.faceImage1.imageUrl
            },
            image2: {
              base64Image: this.faceImage2.base64Image,
              imageUrl: this.faceImage2.imageUrl
            }
          }
        })
        .toPromise();

      this.compareFacesCompleted = true;

      // If we have a match, then hide the capture button in the image capture component
      this.imageCapture1.setCaptureControlVisibility(!this.faceMatchingResult.isMatching);
      this.imageCapture2.setCaptureControlVisibility(!this.faceMatchingResult.isMatching);
    } catch (error) {
      this.log.e(error);
      this.error = error;
    } finally {
      this.comparing = false;
    }
  }

  onRejectClicked(): void {
    const gatheredFrom = this.imageCapture2.imageProvidingUser.data.id;

    const data = this.activityData[gatheredFrom];

    data.payload = {
      image1: this.faceImage1,
      image2: this.faceImage2,
      faceMatchingResult: this.faceMatchingResult
    };

    this.onActivityActionForAllParticipants(false);
  }

  onNextClicked(): void {
    const gatheredFrom = this.imageCapture2.imageProvidingUser.data.id;

    const data = this.activityData[gatheredFrom];

    data.payload = {
      image1: this.faceImage1,
      image2: this.faceImage2,
      faceMatchingResult: this.faceMatchingResult
    };

    this.onActivityActionForAllParticipants(true);
  }

  onActivityStateChanged(payload: any): void {}

  onActivityDataPublished(): void {
    if (this.shouldDisplayResults && !this.compareFacesCompleted) {
      const gatheredFrom = this.imageCapture2?.imageProvidingUser?.data?.id;

      if (!!gatheredFrom) {
        const payload = this.activityData[gatheredFrom]?.payload;

        if (payload.image1) {
          this.face1Captured = true;
          this.faceImage1 = payload.image1;
          this.imageCapture1.image = this.faceImage1;
        }

        if (payload.image2) {
          this.face2Captured = true;
          this.faceImage2 = payload.image2;
          this.imageCapture2.image = this.faceImage2;
        }
      }
    }
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
