/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';

export class ToolbarButtonSettings {
  @ApiProperty()
  video?: boolean;

  @ApiProperty()
  audio?: boolean;

  @ApiProperty()
  fullScreen?: boolean;

  @ApiProperty()
  screenShare?: boolean;

  @ApiProperty()
  layoutSpeaking?: boolean;

  @ApiProperty()
  exit?: boolean;
}

export class CallUiSettings {
  @ApiProperty()
  chat: boolean;

  @ApiProperty()
  autoPublish: boolean = true;

  @ApiProperty()
  toolbar: boolean = true;

  @ApiProperty()
  footer: boolean;

  @ApiProperty()
  toolbarButtons: ToolbarButtonSettings;
}

export class WorkflowRole {
  @ApiProperty()
  name: string;

  @ApiProperty()
  minNoOfParticipants: number;

  @ApiProperty()
  callUISettings: CallUiSettings;
}
