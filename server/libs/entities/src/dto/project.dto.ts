import { ApiProperty } from '@nestjs/swagger';

export class ProjectDTO {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public name: string;
}
