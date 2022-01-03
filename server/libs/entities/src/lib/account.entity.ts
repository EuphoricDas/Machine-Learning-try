import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Project } from '..';
import { ChangeTracking } from './entity-change-tracking-cols';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 150 })
  name: string;

  @Column(() => ChangeTracking, { prefix: false })
  changeTracking: ChangeTracking;

  @OneToMany(() => Project, (project) => project.accountId)
  public projects: Project[];

  constructor(initialValues?: Partial<Account>) {
    if (initialValues) Object.assign(this, initialValues);
  }
}
