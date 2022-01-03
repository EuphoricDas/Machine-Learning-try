import { ApiProperty } from '@nestjs/swagger';

export class ApiTokenRequestDTO {
  @ApiProperty()
  appId: string;

  @ApiProperty()
  secretKey: string;
}

export class ApiTokenResponseDTO {
  @ApiProperty()
  accessToken: string;

  constructor(initialValues: Partial<ApiTokenResponseDTO>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
