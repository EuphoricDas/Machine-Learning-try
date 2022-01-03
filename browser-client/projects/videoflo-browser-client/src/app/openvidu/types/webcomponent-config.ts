import { OvSettings } from '../types/ov-settings';

export interface ISessionInfo {
  sessionId: string;
  participantId: string;
  sessionName: string;
  participantName: string;
  tokens: string[];
  ovSettings: OvSettings;
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}
