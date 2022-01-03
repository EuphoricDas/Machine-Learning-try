import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivitiesContainerComponent } from './activities/activities-container/activities-container.component';
import { CaptureImageActivityComponent } from './activities/capture-image/capture-image-activity.component';
import { CaptureImageSummaryComponent } from './activities/capture-image/capture-image-summary.component';
import { FaceRecognitionActivityComponent } from './activities/face-recognition/face-recognition-activity.component';
import { FaceRecognitionSummaryComponent } from './activities/face-recognition/face-recognition-summary.component';
import { FinishComponent } from './activities/finish/finish.component';
import { GeolocationActivityComponent } from './activities/geolocation/geolocation-activity.component';
import { GeolocationSummaryComponent } from './activities/geolocation/geolocation-summary.component';
import { ImageCaptureComponent } from './activities/image-capture/image-capture.component';
import { ShowImageComponent } from './activities/image-capture/show-image-dialog/show-image.component';
import { IpInformationActivityComponent } from './activities/ip-information/ip-information-activity.component';
import { IpInformationSummaryComponent } from './activities/ip-information/ip-information-summary.component';
import { ManualPromptActivityComponent } from './activities/manual-prompt/manual-prompt-activity.component';
import { MatchHeadPoseActivityComponent } from './activities/match-head-pose/match-head-pose-activity.component';
import { MatchHeadPoseSummaryComponent } from './activities/match-head-pose/match-head-pose-summary.component';
import { PanRecognitionActivityComponent } from './activities/pan-recognition/pan-recognition-activity.component';
import { PanRecognitionSummaryComponent } from './activities/pan-recognition/pan-recognition-summary.component';
import { QnaActivitySummaryComponent } from './activities/qna/qna-activity-summary.component';
import { QnaActivityComponent } from './activities/qna/qna-activity.component';
import { WelcomeActivityComponent } from './activities/welcome/welcome-activity.component';
import { ClientApiService } from './api/services/client-api.service';
import { ApiConfiguration } from './api/api-configuration';
import { ChatComponent } from './openvidu/components/chat/chat.component';
import { DialogErrorComponent } from './openvidu/components/dialog-error/dialog-error.component';
import { FooterComponent } from './openvidu/components/footer/footer.component';
import { RoomConfigComponent } from './openvidu/components/room-config/room-config.component';
import { OpenViduVideoComponent } from './openvidu/components/stream/ov-video.component';
import { StreamComponent } from './openvidu/components/stream/stream.component';
import { ToolbarLogoComponent } from './openvidu/components/toolbar/logo.component';
import { ToolbarComponent } from './openvidu/components/toolbar/toolbar.component';
import { CdkOverlayContainer } from './openvidu/config/custom-cdk-overlay-container';
import { LinkifyPipe } from './openvidu/pipes/linkfy';
import {
  HasAudioPipe,
  HasChatPipe,
  HasExitPipe,
  HasFooterPipe,
  HasFullscreenPipe,
  HasLayoutSpeakingPipe,
  HasScreenSharingPipe,
  HasToolbarPipe,
  HasVideoPipe,
  IsAutoPublishPipe
} from './openvidu/pipes/ovSettings.pipe';
import { TooltipListPipe } from './openvidu/pipes/tooltipList.pipe';
import { ChatService } from './openvidu/services/chat/chat.service';
import { DevicesService } from './openvidu/services/devices/devices.service';
import { LocalUsersService } from './openvidu/services/local-users/local-users.service';
import { LoggerService } from './openvidu/services/logger/logger.service';
import { NetworkService } from './openvidu/services/network/network.service';
import { NotificationService } from './openvidu/services/notifications/notification.service';
import { OpenViduWebrtcService } from './openvidu/services/openvidu-webrtc/openvidu-webrtc.service';
import { RemoteUsersService } from './openvidu/services/remote-users/remote-users.service';
import { StorageService } from './openvidu/services/storage/storage.service';
import { UtilsService } from './openvidu/services/utils/utils.service';
import { DynamicComponentHostDirective } from './shared/dynamic-component-host.directive';
import { ModalDialogComponent } from './shared/modal-dialog/modal-dialog.component';
import { VideoRoomComponent } from './video-room/video-room.component';
import { CallConsentComponent } from './videoflo-component/precall-checks/call-consent/call-consent.component';
import { ChecklistComponent } from './videoflo-component/precall-checks/checklist/checklist.component';
import { DevicePermissionsComponent } from './videoflo-component/precall-checks/device-permissions/device-permissions.component';
import { PrecallChecksComponent } from './videoflo-component/precall-checks/precall-checks.component';
import { VideofloComponent } from './videoflo-component/videoflo.component';

@NgModule({
  declarations: [
    VideoRoomComponent,
    StreamComponent,
    ChatComponent,
    OpenViduVideoComponent,
    DialogErrorComponent,
    RoomConfigComponent,
    VideofloComponent,
    ToolbarComponent,
    ToolbarLogoComponent,
    LinkifyPipe,
    HasChatPipe,
    HasAudioPipe,
    HasVideoPipe,
    IsAutoPublishPipe,
    HasScreenSharingPipe,
    HasFullscreenPipe,
    HasLayoutSpeakingPipe,
    HasExitPipe,
    HasFooterPipe,
    HasToolbarPipe,
    TooltipListPipe,
    DynamicComponentHostDirective,
    ModalDialogComponent,
    FooterComponent,
    ActivitiesContainerComponent,
    CaptureImageActivityComponent,
    CaptureImageSummaryComponent,
    FaceRecognitionActivityComponent,
    FaceRecognitionSummaryComponent,
    FinishComponent,
    GeolocationActivityComponent,
    GeolocationSummaryComponent,
    ImageCaptureComponent,
    ShowImageComponent,
    IpInformationActivityComponent,
    IpInformationSummaryComponent,
    ManualPromptActivityComponent,
    PanRecognitionActivityComponent,
    PanRecognitionSummaryComponent,
    QnaActivityComponent,
    QnaActivitySummaryComponent,
    MatchHeadPoseActivityComponent,
    MatchHeadPoseSummaryComponent,
    WelcomeActivityComponent,
    PrecallChecksComponent,
    CallConsentComponent,
    DevicePermissionsComponent,
    ChecklistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatGridListModule,
    MatListModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    FlexLayoutModule,
  ],
  entryComponents: [DialogErrorComponent, VideofloComponent],
  providers: [
    ClientApiService,
    ApiConfiguration,
    NetworkService,
    OpenViduWebrtcService,
    LocalUsersService,
    RemoteUsersService,
    UtilsService,
    DevicesService,
    LoggerService,
    ChatService,
    NotificationService,
    StorageService,
    CdkOverlayContainer,
    { provide: OverlayContainer, useClass: CdkOverlayContainer },
  ],
  exports: [VideofloComponent]
})
export class VideofloModule { }
