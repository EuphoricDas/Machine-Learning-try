import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType, Document } from 'mongoose';

export type RequestLogDocument = RequestLog & Document;

@Schema()
export class RequestLog {
  @Prop()
  timestamp?: SchemaType.Types.Date;

  @Prop()
  request?: SchemaType.Types.Mixed;

  @Prop()
  response?: SchemaType.Types.Mixed;

  @Prop()
  statusCode?: number;

  @Prop()
  jobId?: number;

  @Prop()
  fireForget?: boolean;

  @Prop()
  errorMessage?: string;

  @Prop()
  sessionId: string;
}

export const requestLogSchema = SchemaFactory.createForClass(RequestLog);

export const requestLogCollection = 'RequesLogs';
