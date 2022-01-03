import { ApiProperty } from '@nestjs/swagger';

export class UpdateMru{
	@ApiProperty()
	accId: number
	@ApiProperty()
	projectId: number
}