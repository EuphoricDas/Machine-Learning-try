import { MatchHeadPoseResultDto } from '../api/models';
import { FacePose } from './match-head-pose-configuration';

export class MatchHeadPoseItemState {
  pose: FacePose;
  isCaptureButtonVisible: boolean;
  isInProgress: boolean;
  progress = 0;
  isCheckingHeadPoses: boolean;
  frames: string[];
  result?: MatchHeadPoseResultDto;
  error?: any;

  constructor(initialValues?: Partial<MatchHeadPoseItemState>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }

  get poseName(): string {
    const poseName = {
      [FacePose.facestraight]: 'Face Straight',
      [FacePose.faceright]: 'Face Right',
      [FacePose.faceleft]: 'Face Left',
      [FacePose.faceup]: 'Face Up',
      [FacePose.facedown]: 'Face Down',
      [FacePose.tiltright]: 'Tilt Right',
      [FacePose.tiltleft]: 'Tilt Left'
    };

    return poseName[this.pose];
  }

  get instruction(): string {
    const instructions = {
      [FacePose.facestraight]: 'Keep your head straight and look straight at the camera.',
      [FacePose.faceright]: 'Turn your face to the right.',
      [FacePose.faceleft]: 'Turn your face to the left.',
      [FacePose.faceup]: 'Turn your face up.',
      [FacePose.facedown]: 'Turn your face down.',
      [FacePose.tiltright]: 'Tilt your head to right.',
      [FacePose.tiltleft]: 'Tilt your head to left.'
    };

    return instructions[this.pose];
  }

  get isVisible(): boolean {
    return this.isCaptureButtonVisible || this.isInProgress || !!this.result || this.error;
  }

  get isSuccess(): boolean {
    if (this.result?.response?.results) {
      const totalItems = this.result.response.results.length;

      const poseMatchingItems = this.result.response.results.filter((item) => item.result === true).length;

      const matchingProportion = poseMatchingItems / totalItems;

      // If 3/4th of the poses are matching, then we are good.
      return matchingProportion >= 0.75;
    }

    return false;
  }

  get isPoseNotMatching(): boolean {
    if (this.isSuccess) {
      return false;
    }

    // If not success and also no error responses, then the pose definitely did not match
    const errorItems = this.result?.response?.results?.filter((item) => !!item.errorCode)?.length;

    return errorItems < 1;
  }

  get hasError(): boolean {
    if (this.isSuccess) {
      return false;
    }

    if (!!this.error) {
      return true;
    }

    const errorItems = this.result?.response?.results?.filter((item) => !!item.errorCode)?.length;

    return errorItems > 0;
  }

  get errorMessages(): string {
    if (this.error) {
      return 'Unknown error';
    }

    if (!this.result?.response?.results) {
      return 'No Result!';
    }

    const errorMessages = [
      ...new Set(this.result.response.results.filter((item) => !!item.errorCode).map((item) => item?.errorMessage?.toString()))
    ];

    return errorMessages.join();
  }
}

export class MatchHeadPoseState {
  items: MatchHeadPoseItemState[] = [];

  curItemIndex = 0;

  isCompleted = false;

  get allPosesCompleted(): boolean {
    return this.curItemIndex >= this.items.length;
  }

  get currentItem(): MatchHeadPoseItemState {
    return this.items[this.curItemIndex];
  }

  constructor(initialValues?: Partial<MatchHeadPoseState>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }
}
