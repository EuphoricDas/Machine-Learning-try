import { ApiProperty } from '@nestjs/swagger';

export class SessionDataRequestDTO {
  @ApiProperty()
  sessionId: string;

  constructor(initialValues?: Partial<SessionDataRequestDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
