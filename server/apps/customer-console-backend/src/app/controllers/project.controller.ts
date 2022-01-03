import { PaginationAndSort, ProjectPaginatedAndSortedResult, SortOrder } from './../dto/paginationAndsort';
import { ProjectAddUpdateDTO } from './../dto/project-add-update.dto';
import { ProjectInfoDTO } from './../dto/project-info.dto';
import { AccountUser, guid, Project } from '@botaiml-videoflo/entities';
import { Controller, Delete, Get, Param, Post, Req, UseGuards, NotFoundException, BadRequestException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { getRepository, Like, Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';

@Controller('project')
@ApiTags('project')
export class ProjectController {
  constructor( @InjectRepository(AccountUser)
  private readonly accountUserRepo: Repository<AccountUser>,
  @InjectRepository(Project)
  private readonly projectRepo: Repository<Project>,
  private projectService: ProjectService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'getAllProjects', tags: ['rest'] })
  @Post('getAllProjects')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: ProjectPaginatedAndSortedResult
  })
  async getAllProjects(@Req() req: Request | any, @Body() pagination: PaginationAndSort) {
    const userId = req.user.id
    const user = await this.accountUserRepo.findOne({
			where:{ 
			  id:userId
			},
			relations:['projects']
		  })

    const builder = await this.projectService.queryBuilder('projects');

    if(pagination.SearchString){
      builder.where("projects.name ILIKE :s OR projects.description LIKE :s", {s: '%' + pagination.SearchString + '%' })
    }

    const sortOrder:any = pagination.SortOrder
    if(sortOrder){
      if(pagination.SortField){
        switch (pagination.SortField) {
          case 'id':
            builder.orderBy('projects.id', 'DESC');
            break;
          case 'name':
            builder.orderBy('projects.name','DESC')
            break;
        
          default:
            break;
        }
      }
    }

    if(pagination.SkipRows){
      builder.skip(pagination.SkipRows)
    }
    if(pagination.NoOfRows){
      builder.take(pagination.NoOfRows)
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = pagination.NoOfRows;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    const allProjects = await builder.getMany()
    const proj = allProjects.filter((p) => p.accountId === user.accountId)

    const retVal: ProjectPaginatedAndSortedResult = new ProjectPaginatedAndSortedResult()
    retVal.rows = proj
    retVal.totalRows = total

    //   return {
    //     data: await builder.getMany(),
    //     total,
    //     page,
    //     last_page: Math.ceil(total / perPage)
    // };
    return retVal

  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'create', tags: ['rest'] })
  @Post('create')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Number
  })
  async create(@Req() req: any, @Body() newProjectInfo:ProjectAddUpdateDTO){
    const userId = req.user.id

    const user = await this.accountUserRepo.findOne({
      where:{ 
        id:userId
      },
      relations:['projects']
    })
    const appId = guid()
    const secretKey = guid() + guid()
    
    const projects:Project = new Project()
    projects.name = newProjectInfo.name
    projects.description = newProjectInfo.description
    projects.accountId = user.accountId
    projects.appId = appId
    projects.secretKey = secretKey
    
    const project = await this.projectRepo.save(projects)
    user.projects.push(project)
    this.accountUserRepo.save(user)
    
    return project.id

  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'update', tags: ['rest'] })
  @Post('update')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Number
  })
  async update(@Req() req: any, @Body() updateProjectInfo:ProjectAddUpdateDTO){
    const userId = req.user.id

    const user = await this.accountUserRepo.findOne({
      where:{ 
        id:userId
      },
      relations:['projects']
    })
    const projects = user.projects.find((p) => p.id === updateProjectInfo.id)
    if(projects == null){
      return NotFoundException
    }
    projects.name = updateProjectInfo.name
    projects.description = updateProjectInfo.description
    projects.roles = updateProjectInfo.roles

    const project = await this.projectRepo.save(projects)
    return project.id

  }

  @ApiOperation({ operationId: 'deleteProject', tags: ['rest'] })
  @Get('delete/:id')
  @ApiBadRequestResponse()
  //@UseGuards(JwtAuthGuard)
  async deleteProject(@Param('id') id: number) {
    const project = await this.projectRepo.findOne({
      where: {
        id:id
      }
    })
    if(project === undefined){
      return BadRequestException
    }
    
    return await this.projectRepo.delete({id:id})
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'getProjectById', tags: ['rest'] })
  @Get(':id')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: ProjectInfoDTO
  })
  async getProjectById(@Req() req: any, @Param('id') id: number) {
    const userId = req.user.id
    const user = await this.accountUserRepo.findOne({
      where:{ 
        id:userId
      },
      relations:['projects']
    })
    const projects = user.projects.find((p) => p.id == id)
    
    if(projects == null){
      return NotFoundException
    }
    return new ProjectInfoDTO({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      loggedUserRole: user.userRole,
      appId: projects.appId,
      secretKey: projects.secretKey,
      userCount: 2,
      roles: projects.roles
    })
  }
}
