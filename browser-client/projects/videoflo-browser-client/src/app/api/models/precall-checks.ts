/* tslint:disable */
/* eslint-disable */
import { CallConsent } from './call-consent';
import { DevicePermissionsChecklist } from './device-permissions-checklist';
import { PrecallChecklist } from './precall-checklist';
import { PrecallChecksAwaitMessage } from './precall-checks-await-message';
export interface PrecallChecks {
  awaitCallJoining?: boolean;
  awaitMessage?: PrecallChecksAwaitMessage;
  checklist?: Array<PrecallChecklist>;
  consent?: CallConsent;
  devicePermissions: DevicePermissionsChecklist;
  isCompleted?: boolean;
}
