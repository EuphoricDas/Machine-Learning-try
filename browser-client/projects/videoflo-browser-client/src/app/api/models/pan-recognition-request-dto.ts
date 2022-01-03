/* tslint:disable */
/* eslint-disable */
import { ImageSourceDto } from './image-source-dto';
export interface PanRecognitionRequestDto {
  fieldsToRetrieve?: Array<string>;
  image: ImageSourceDto;
}
