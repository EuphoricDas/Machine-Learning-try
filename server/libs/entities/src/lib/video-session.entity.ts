import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class VideoSession {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  sessionId: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  createdOn: Date;

  @ApiProperty()
  @Column({ name: 'projectId' })
  projectId: number;

  @ApiProperty()
  @ManyToOne(() => Project, (project) => project.id)
  project: Project;

  constructor(initialValues?: Partial<VideoSession>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
