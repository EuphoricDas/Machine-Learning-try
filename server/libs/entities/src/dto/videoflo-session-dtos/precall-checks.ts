import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { GeocodingResultsDTO } from './google-geocoding';
import { IpLookupResponseDTO } from './ip-lookup-response.dto';

export abstract class ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  subTitle?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  body?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  footer?: string;
}

export abstract class CheckListItemWithContinueButtonTextBase extends ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  continueButtonText?: string = 'Continue';
}

export class CallConsent extends CheckListItemWithContinueButtonTextBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  checkboxText: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  validationErrorText?: string = 'You need to agree to the terms before you can continue.';
}

export class DevicePermissionsChecklist extends ChecklistItemBase {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  subTitle?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  body?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  geolocation?: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  ipAddress?: boolean;

  @ApiProperty()
  @Prop()
  camera: string;

  @ApiProperty()
  @Prop()
  microphone: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  footer?: string;
}

export class PrecallChecklist extends CheckListItemWithContinueButtonTextBase {
  @ApiProperty()
  @Prop()
  id: string;

  @ApiProperty({ type: [String], required: false })
  @Prop({ required: false })
  items?: string[];
}

export class PrecallChecksAwaitMessage {
  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  description: string;
}

export class PrecallChecks {
  @ApiProperty({ required: false })
  @Prop({ required: false })
  awaitCallJoining?: boolean;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  awaitMessage?: PrecallChecksAwaitMessage;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  consent?: CallConsent;

  @ApiProperty()
  @Prop()
  devicePermissions: DevicePermissionsChecklist;

  @ApiProperty({ type: [PrecallChecklist], required: false })
  @Prop({ type: [PrecallChecklist], required: false })
  checklist?: PrecallChecklist[];

  @ApiProperty({ required: false })
  @Prop({ required: false })
  isCompleted?: boolean;

  constructor(initialValues: Partial<PrecallChecks>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
