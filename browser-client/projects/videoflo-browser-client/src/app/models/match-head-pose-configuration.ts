export interface MatchHeadPoseConfiguration {
  title: string;
  description: string;
  noOfFramesToCheck: number;
  noOfPosesToCheck: number;
  poses: Array<FacePose>;
}

export enum FacePose {
  facestraight = 'facestraight',
  faceleft = 'faceleft',
  faceright = 'faceright',
  faceup = 'faceup',
  facedown = 'facedown',
  tiltright = 'tiltright',
  tiltleft = 'tiltleft',
}
