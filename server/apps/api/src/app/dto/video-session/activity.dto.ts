import { ApiProperty } from '@nestjs/swagger';

export class ActivityDTO {
  @ApiProperty()
  activityId: string;

  @ApiProperty()
  activityType: string;

  constructor(initialValues?: Partial<ActivityDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
