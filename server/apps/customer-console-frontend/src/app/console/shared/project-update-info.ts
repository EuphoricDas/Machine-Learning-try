export class ProjectUpdateInfo {
  name: string = '';
  minNoOfParticipants: number;
  callUISettings: CallUiSettings;
}
export class CallUiSettings {
  chat: boolean;
  toolbarButtons: ToolbarButtonSettings;
}
export class ToolbarButtonSettings {
  audio?: boolean;
  exit?: boolean;
  fullScreen?: boolean;
  layoutSpeaking?: boolean;
  screenShare?: boolean;
  video?: boolean;
}
