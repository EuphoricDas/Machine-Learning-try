/* eslint-disable @typescript-eslint/naming-convention */
export * from './activity-data';
export * from './activity-participant-data';
export * from './participant';
export * from './quorum-entry';
export * from './google-geocoding';
export * from './ip-lookup-response.dto';
export * from './videoflo-session';
export * from './workflow-activity';
export * from './workflow-data';
export * from './precall-checks';
export * from './precall-check-responses';

import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VideofloSession } from '.';

export type VideofloSessionDocument = VideofloSession & Document;

export const VideofloSessionSchema = SchemaFactory.createForClass(VideofloSession);

export const VideofloSessionsCollection = 'Sessions';
