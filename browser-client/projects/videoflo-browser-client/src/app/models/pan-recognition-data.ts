import { PanRecognitionResponseDto } from '../api/models';
import { ImageCaptureResult } from '../activities/image-capture/image-capture-result';

export interface PanRecognitionData {
  image: ImageCaptureResult;
  faceMatchingResult: PanRecognitionResponseDto;
}
