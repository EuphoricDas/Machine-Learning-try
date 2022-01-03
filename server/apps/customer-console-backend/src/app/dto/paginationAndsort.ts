import { ProjectDTO } from '@botaiml-videoflo/entities';
import { ApiProperty } from "@nestjs/swagger"

export enum SortOrder{
	ASC = `ASC` ,
	DESC = 'DSC'
}

export class PaginationAndSort{
	@ApiProperty()
	SkipRows: number
	@ApiProperty()
	NoOfRows: number
	@ApiProperty()
	SortField: string
	@ApiProperty()
	SortOrder: SortOrder
	@ApiProperty()
	SearchString: string
}
export class ProjectPaginatedAndSortedResult {
    @ApiProperty({
		type: [ProjectDTO]
	})
	rows: Array<ProjectDTO>;
	@ApiProperty()
	totalRows: number;
  }