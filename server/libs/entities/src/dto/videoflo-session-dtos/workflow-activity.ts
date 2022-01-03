import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkflowActivity {
  @Prop()
  @ApiProperty()
  public id: string;

  @Prop()
  @ApiProperty()
  public activityType: string;

  @Prop({ type: [String] })
  @ApiProperty()
  public gatherFrom: string[];

  @Prop({ type: [String] })
  @ApiProperty()
  public displayTo: string[];

  @Prop({ type: Object })
  @ApiProperty({ type: Object })
  public configuration: any;

  @Prop()
  @ApiPropertyOptional()
  public onActivityDataGathered?: string;

  @Prop()
  @ApiPropertyOptional()
  public onActivityAction?: string;

  constructor(initialValues?: Partial<WorkflowActivity>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
