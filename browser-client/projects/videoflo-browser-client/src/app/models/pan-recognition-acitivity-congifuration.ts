import { ImageSource } from "./image-source";

export interface PanRecognitionActivityConfiguration {
  title: string;
  description: string;
  image: ImageSource;
  requiredFields: string[];
  optionalFields: string[];
  responseRequired: boolean;
}
