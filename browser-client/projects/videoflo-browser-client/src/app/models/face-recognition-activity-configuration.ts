import { ImageSource } from './image-source';

export interface FaceRecognitionActivityConfiguration {
  title: string;
  description: string;
  face1: ImageSource;
  face2: ImageSource;
}
