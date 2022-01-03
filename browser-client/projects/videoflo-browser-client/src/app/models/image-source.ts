import { ImageSourceType } from "./image-source-type";


export interface ImageSource {
  sourceType: ImageSourceType;
  value?: string;
  caption?: string;
  displayTo: string[];
  instructionTitle?: string;
  instructionDescription?: string;
  capturerExternalId?: string;
  capturerInstructionTitle?: string;
  capturerInstructionDescription?: string;
}
