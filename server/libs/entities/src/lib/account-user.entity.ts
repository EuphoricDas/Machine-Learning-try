import { ApiProperty } from '@nestjs/swagger';
import { ChildEntity, Column, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Account } from './account.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

export enum AccountUserRole {
  customerAdmin = 0,
  customerDeveloper = 1,
  customerBiller = 2
}

@ChildEntity()
export class AccountUser extends User {
  @ApiProperty()
  @Column({ nullable: true })
  mostRecentlyUsedProjectId?: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: AccountUserRole,
    default: AccountUserRole.customerDeveloper
  })
  accountUserRole: AccountUserRole;

  @ApiProperty()
  @Column({ name: 'accountId' })
  accountId: number;

  @ApiProperty()
  @OneToOne(() => Account, (account) => account.id, { cascade: true })
  @JoinColumn()
  account: Account;

  @ManyToMany(() => Project)
  @JoinTable()
  projects: Project[];

  constructor(initialValues?: Partial<AccountUser>) {
    super(initialValues);

    if (initialValues) {
      this.mostRecentlyUsedProjectId = initialValues.mostRecentlyUsedProjectId;
      this.accountUserRole = initialValues.accountUserRole;
      this.accountId = initialValues.accountId;
      this.projects = initialValues.projects;
    }
  }
}
