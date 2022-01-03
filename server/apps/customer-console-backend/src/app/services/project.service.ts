import { Project } from '@botaiml-videoflo/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
	constructor( @InjectRepository(Project)
	private readonly projectRepo: Repository<Project>,) {}

	async queryBuilder(alias: string) {
        return this.projectRepo.createQueryBuilder(alias)
    }
	
}
