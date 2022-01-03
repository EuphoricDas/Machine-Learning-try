import { Prop } from '@nestjs/mongoose';
import { GeocodingResultsDTO } from './google-geocoding';
import { IpLookupResponseDTO } from './ip-lookup-response.dto';

export class PrecallChecksChecklistResponses {
  [checklistId: string]: Date;
}

export class PrecallChecksResponses {
  @Prop({ required: false })
  consentTimestamp?: Date;

  @Prop({ required: false })
  cameraPermissionTimestamp?: Date;

  @Prop({ required: false })
  microphonePermissionTimestamp?: Date;

  @Prop({ required: false })
  locationPermissionTimestamp?: Date;

  @Prop({ required: false, type: GeocodingResultsDTO })
  geoLocation?: GeocodingResultsDTO;

  @Prop({ required: false, type: IpLookupResponseDTO })
  ipInformation?: IpLookupResponseDTO;

  @Prop({ required: false, type: PrecallChecksChecklistResponses })
  checklists?: PrecallChecksChecklistResponses;

  constructor(initialValues: Partial<PrecallChecksResponses>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
