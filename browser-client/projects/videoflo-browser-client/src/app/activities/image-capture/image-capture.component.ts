import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivityConfig } from '../../models/activity';
import { ImageSource } from '../../models/image-source';
import { ImageSourceType } from '../../models/image-source-type';
import { UserModel } from '../../openvidu/models/user-model';
import { LocalUsersService } from '../../openvidu/services/local-users/local-users.service';
import { RemoteUsersService } from '../../openvidu/services/remote-users/remote-users.service';
import { ActivitiesService } from '../../services/activities.service';
import { ImageCaptureResult } from './image-capture-result';
import { ShowImageComponent, ImageDialogData } from './show-image-dialog/show-image.component';

@Component({
  selector: 'videoflo-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.css']
})
export class ImageCaptureComponent implements OnInit, OnDestroy {
  @Input() activityConfig: ActivityConfig;

  @Input() imageSource: ImageSource;

  @Input() isApprover = false;

  showCaptureControl = true;

  @Output() beginImageCapture = new EventEmitter<any>();

  @Output() imageCaptured = new EventEmitter<ImageCaptureResult>();

  @ViewChild('fileInput') fileInput: ElementRef;

  @ViewChild('instructions') instructions: TemplateRef<any>;

  imageRequestSubscription: Subscription;
  imageResponseSubscription: Subscription;

  set image(value: ImageCaptureResult) {
    this.imageValue = value.base64Image ? value.base64Image : value.imageUrl;
  }

  // Need this variable to access the enum from HTML template.
  // Else there is no way to import the enum into HTML template and use it for switch/if/else conditions
  ImageSourceType = ImageSourceType;

  imageProvidingUser: UserModel;

  isImageCapturer = false;
  isImageProvider = false;
  shouldDisplayValue = false;

  imageValue = '';

  isCapturing = false;
  isImageCaptured = false;

  constructor(
    private activitiesService: ActivitiesService,
    private localUsersService: LocalUsersService,
    private remoteUsersService: RemoteUsersService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.imageRequestSubscription = this.activitiesService.onCaptureImageRequest$.subscribe((val) => {
      this.onCameraImageRequested();
    });

    this.imageResponseSubscription = this.activitiesService.onCaptureImageResponse$.subscribe((val) => {
      this.onCameraImageResponse(val?.responseData?.image);
    });

    // Initializing in setTimeout to get rid of the dreaded ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.initializeView();
    }, 0);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ShowImageComponent, {
      data: <ImageDialogData>{
        image: this.imageValue,
        caption: this.imageSource.caption
      }
    });

    dialogRef.afterClosed().subscribe((r) => {
      console.log(`Dialog result: ${r}`);
    });
  }

  private initializeView(): void {
    if (this.isApprover || (this.isPreloadedImage && this.imageSource.displayTo?.includes(this.activitiesService.externalParticipantId))) {
      this.shouldDisplayValue = true;
    } else {
      this.shouldDisplayValue = false;
    }

    if (this.isPreloadedImage) {
      this.imageValue = this.imageSource.value;
    }

    this.isImageProvider = !this.isPreloadedImage && this.activityConfig.gatherFrom?.includes(this.activitiesService.participantRole);
    this.isImageCapturer = this.imageSource.capturerExternalId === this.activitiesService.externalParticipantId;

    if (!this.isImageProvider) {
      this.remoteUsersService.remoteUsers.subscribe((users) => {
        for (const user of users) {
          if (this.activityConfig.gatherFrom?.includes(user.data.role)) {
            this.imageProvidingUser = user;

            // We should emit the imageCaptured event only after we have identified the imageProvidingUser
            this.emitImageCapturedIfPreloaded();

            break;
          }
        }
      });
    } else {
      this.localUsersService.OVUsers.subscribe((users) => {
        if (users) {
          this.imageProvidingUser = users[0];

          // We should emit the imageCaptured event only after we have identified the imageProvidingUser
          this.emitImageCapturedIfPreloaded();
        }
      });
    }
  }

  private emitImageCapturedIfPreloaded(): void {
    if (this.imageSource.sourceType === ImageSourceType.Base64 && !!this.imageSource.value) {
      this.isImageCaptured = true;
      this.imageCaptured.emit({
        base64Image: this.imageSource.value
      });
    } else if (this.imageSource.sourceType === ImageSourceType.URL && !!this.imageSource.value) {
      this.isImageCaptured = true;
      this.imageCaptured.emit({
        imageUrl: this.imageSource.value
      });
    }
  }

  private get isPreloadedImage() {
    return (
      (this.imageSource.sourceType === ImageSourceType.Base64 || this.imageSource.sourceType === ImageSourceType.URL) &&
      this.imageSource.value
    );
  }

  setCaptureControlVisibility(isVisible: boolean) {
    this.showCaptureControl = isVisible;
  }

  get showImage() {
    if (this.imageSource.sourceType === ImageSourceType.Base64 || this.imageSource.sourceType === ImageSourceType.URL) {
      return this.shouldDisplayValue;
    }

    return (this.isImageProvider || this.isImageCapturer || this.isApprover) && this.imageValue;
  }

  onSwitchCameraClicked() {}

  async onCameraCaptureClicked() {
    this.isCapturing = true;
    this.isImageCaptured = false;

    this.activitiesService.requestForImage({
      type: 'request',
      requestData: {}
    });
  }

  onCameraImageRequested() {
    if (!this.isImageProvider) return;

    this.isCapturing = true;
    this.isImageCaptured = false;

    this.localUsersService.OVUsers.subscribe((users) => {
      const cameraUser = users.find((u) => u.isCamera());

      const video = cameraUser.getStreamManager()?.videos[0].video;

      if (video) {
        const canvas = document.createElement('canvas');

        // scale the canvas accordingly
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // grab the frame from the video element and draw it on the canvas
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        // get image data as base64 data URI and send it back to via websocket
        this.activitiesService.requestForImage({
          type: 'responseImage',
          responseData: { image: canvas.toDataURL('image/jpeg') }
        });
      }

      this.isCapturing = false;
      this.isImageCaptured = true;
    });
  }

  onCameraImageResponse(value: string) {
    if (!this.isImageCapturer) return;

    this.imageValue = value;

    this.imageCaptured.emit({
      base64Image: this.imageValue
    });

    this.isCapturing = false;
    this.isImageCaptured = true;
  }

  onFileSelected() {
    if (typeof FileReader !== 'undefined') {
      const file = this.fileInput.nativeElement.files[0];

      const reader = new FileReader();

      reader.onload = (e: any) => {
        const typedArray = new Uint8Array(e.target.result);
        const stringChar = String.fromCharCode(...typedArray);

        this.imageValue = `data:${file.type};base64,${btoa(stringChar)}`;

        this.imageCaptured.emit({
          base64Image: this.imageValue
        });
      };

      reader.readAsArrayBuffer(file);
    }
  }

  ngOnDestroy(): void {
    this.imageRequestSubscription.unsubscribe();
    this.imageResponseSubscription.unsubscribe();
  }
}
