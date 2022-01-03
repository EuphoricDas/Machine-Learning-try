/* tslint:disable */
/* eslint-disable */
import { CallUiSettings } from './call-ui-settings';
export interface VideoSessionJoinDto {
  callUISettings: CallUiSettings;
  screenShareToken: string;
  videoLayoutSettings: { [key: string]: string };
  webcamToken: string;
}
