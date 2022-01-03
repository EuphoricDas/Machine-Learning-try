import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { ChangeTracking } from './entity-change-tracking-cols';
import { WorkflowRole } from './workflow-role.entity';

@Entity()
@Unique('Unique_Project_appId_secretKey', ['appId', 'secretKey'])
export class Project {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @ApiProperty()
  @Column({ nullable: false, length: 250 })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: true
  })
  roles: WorkflowRole[];

  @ApiProperty()
  @Column({ nullable: false, length: 50 })
  appId: string;

  @ApiProperty()
  @Column({ nullable: false, length: 100 })
  secretKey: string;

  @Column({ name: 'accountId' })
  accountId: number;

  @Column(() => ChangeTracking, { prefix: false })
  changeTracking: ChangeTracking;

  @ManyToOne(() => Account, (account) => account.id, { cascade: true })
  @JoinColumn({ name: 'accountId', referencedColumnName: 'id' })
  account: Account;
}
