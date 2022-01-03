import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchHeadPoseImageItemDto, MatchHeadPoseRequestDto } from '../../api/models';
import { ClientApiService } from '../../api/services/client-api.service';
import { FacePose, MatchHeadPoseConfiguration } from '../../models/match-head-pose-configuration';
import { UserModel } from '../../openvidu/models/user-model';
import { LocalUsersService } from '../../openvidu/services/local-users/local-users.service';
import { RemoteUsersService } from '../../openvidu/services/remote-users/remote-users.service';
import { ActivitiesService } from '../../services/activities.service';
import { Utils } from '../../shared/utils';
import { ActivityComponent } from '../activity.component';
import { MatchHeadPoseState, MatchHeadPoseItemState } from '../../models/match-head-pose-state';
import { LoggerService } from '../../openvidu/services/logger/logger.service';
import { ILogger } from '../../openvidu/types/logger-type';
import { environment } from '../../environments/environment';

@Component({
  selector: 'videoflo-match-head-pose-activity',
  templateUrl: './match-head-pose-activity.component.html',
  styles: []
})
export class MatchHeadPoseActivityComponent extends ActivityComponent implements OnInit, OnDestroy {
  activeLivenessCheckState: MatchHeadPoseState;

  curItem: MatchHeadPoseState;

  private user: UserModel;

  production = environment.production;

  log: ILogger;

  constructor(
    private clientApiService: ClientApiService,
    activitiesService: ActivitiesService,
    private remoteUsersService: RemoteUsersService,
    private loggerService: LoggerService
  ) {
    super(activitiesService);

    this.log = this.loggerService.get(MatchHeadPoseActivityComponent.name);
  }

  async ngOnInit(): Promise<void> {
    super.OnInit();

    if (this.shouldDisplayResults) {
      this.remoteUsersService.remoteUsers.subscribe((users) => {
        if (!users) {
          return;
        }

        for (let i = 0; i < users.length; i++) {
          const user = users[i];

          if (this.activity.gatherFrom.includes(user.data.role)) {
            this.user = user;

            // We should initialize the head poses and other stuff only after we get hold of the video element.
            // Otherwise the user might click "Start" button and we might get errors when capturing frames.
            this.initHeadPosesToMatch();

            break;
          }
        }
      });
    }
  }

  get config(): MatchHeadPoseConfiguration {
    return this.activity.configuration as MatchHeadPoseConfiguration;
  }

  private async initHeadPosesToMatch(): Promise<void> {
    if (!this.shouldDisplayResults) {
      return;
    }

    if (!this.video) {
      setTimeout(() => {
        this.initHeadPosesToMatch();
      }, 300);
      return;
    }

    if (!this.config.noOfPosesToCheck || this.config.poses.length < this.config.noOfPosesToCheck) {
      this.config.noOfPosesToCheck = this.config.poses.length;
    }

    const posesToCheck = Utils.shuffleArray(this.config.poses).splice(0, this.config.noOfPosesToCheck);

    this.activeLivenessCheckState = new MatchHeadPoseState({
      curItemIndex: 0,
      items: posesToCheck.map(
        (pose) =>
          new MatchHeadPoseItemState({
            pose: <FacePose>pose,
            isInProgress: false
          })
      ),
      isCompleted: false
    });

    await this.initCurrentPoseCheck();
  }

  private async initCurrentPoseCheck() {
    if (this.activeLivenessCheckState.allPosesCompleted) {
      // All poses are verified, push data to the server.
      this.activitiesService.submitActivityDataGathered(this.activity.id, {
        gatheredFrom: this.user.data.id,
        payload: this.activeLivenessCheckState.items.map((item) => ({
          pose: item.result.pose,
          result: {
            success: item.result.response.success,
            errorCode: item.result.response.errorCode,
            errorMessage: item.result.response.errorMessage,
            frameResults: item.result.response.results.map((r, frameIndex) => ({
              imageId: r.imageId,
              image: item.frames[frameIndex],
              result: r.result,
              errorCode: r.errorCode,
              errorMessage: r.errorMessage
            }))
          }
        }))
      });

      return;
    }

    this.activeLivenessCheckState.currentItem.isCaptureButtonVisible = true;
    this.activeLivenessCheckState.currentItem.isInProgress = false;

    this.publishActivityState();
  }

  async onVerifyPoseClicked(): Promise<void> {
    this.activeLivenessCheckState.currentItem.result = null;
    await this.verifyCurrentPose();
  }

  async onContinueToNextPoseClicked(): Promise<void> {
    this.activeLivenessCheckState.curItemIndex++;
    await this.initCurrentPoseCheck();
  }

  private async verifyCurrentPose() {
    if (this.activeLivenessCheckState.allPosesCompleted) {
      return;
    }

    this.activeLivenessCheckState.currentItem.isCaptureButtonVisible = false;
    this.activeLivenessCheckState.currentItem.isInProgress = true;

    // Reset any previous errors
    this.activeLivenessCheckState.currentItem.error = null;

    this.publishActivityState();

    try {
      const base64Images = await this.captureFrames();

      this.activeLivenessCheckState.currentItem.frames = base64Images;

      this.activeLivenessCheckState.currentItem.isCheckingHeadPoses = true;

      this.publishActivityState();

      const requestInfo: MatchHeadPoseRequestDto = {
        pose: this.activeLivenessCheckState.currentItem.pose,
        images: base64Images.map(
          (imgBase64, index) =>
            <MatchHeadPoseImageItemDto>{
              imageid: index + 1,
              image: imgBase64
            }
        )
      };

      this.activeLivenessCheckState.currentItem.result = await this.clientApiService.matchHeadPose({ body: requestInfo }).toPromise();
    } catch (error) {
      this.log.e(error);
      this.activeLivenessCheckState.currentItem.error = error;
    } finally {
      this.activeLivenessCheckState.currentItem.isCaptureButtonVisible = false;
      this.activeLivenessCheckState.currentItem.isInProgress = false;
      this.activeLivenessCheckState.currentItem.isCheckingHeadPoses = false;
      this.publishActivityState();
    }

    if (this.activeLivenessCheckState.currentItem.isSuccess) {
      this.activeLivenessCheckState.curItemIndex++;
      this.initCurrentPoseCheck();
    }

    this.publishActivityState();
  }

  private async captureFrames(): Promise<string[]> {
    const video = this.video;

    if (!video) {
      throw new Error('Unable to locate video element of local user!');
    }

    const noOfFrames = this.config.noOfFramesToCheck;

    this.activeLivenessCheckState.currentItem.progress = 0;

    const arr: string[] = [];

    for (let i = 0; i < noOfFrames; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      arr.push(canvas.toDataURL('image/jpeg'));

      this.activeLivenessCheckState.currentItem.progress = Math.round(((i + 1) / noOfFrames) * 100);

      this.publishActivityState();

      await Utils.delay(300);
    }

    return arr;
  }

  private publishActivityState(): void {
    this.activitiesService.publishActivityState(this.activity.id, {
      gatheredFrom: this.activitiesService.participantId,
      payload: {
        curItemIndex: this.activeLivenessCheckState.curItemIndex,
        items: this.activeLivenessCheckState.items.map((i) => ({
          pose: i.pose,
          isCaptureButtonVisible: i.isCaptureButtonVisible,
          isInProgress: i.isInProgress,
          progress: i.progress,
          isCheckingHeadPoses: i.isCheckingHeadPoses,
          result: i.result,
          error: i.error
        }))
      }
    });
  }

  get video(): HTMLVideoElement {
    return this.user?.streamManager?.videos[0]?.video;
  }

  onNextClicked() {
    this.onActivityActionForAllParticipants(true);
  }

  onRejectClicked() {
    this.onActivityActionForAllParticipants(false);
  }

  onActivityStateChanged(state: any): void {
    if (this.shouldDisplayResults) {
      return;
    }

    this.activeLivenessCheckState = new MatchHeadPoseState({
      curItemIndex: state.stateData.payload.curItemIndex,
      items: state.stateData.payload.items.map((item) => new MatchHeadPoseItemState(item))
    });
  }

  onActivityDataPublished(): void {
    // Nothing to do here. Data is already synchronized using onActivityStateChanged
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
