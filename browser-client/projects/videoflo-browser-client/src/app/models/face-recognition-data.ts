import { CompareFacesResultDto } from '../api/models';
import { ImageCaptureResult } from '../activities/image-capture/image-capture-result';

export interface FaceRecognitionData {
  image1: ImageCaptureResult;
  image2: ImageCaptureResult;
  faceMatchingResult: CompareFacesResultDto;
}
