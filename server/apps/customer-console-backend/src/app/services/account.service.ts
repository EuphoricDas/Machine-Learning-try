import { Account, AccountUser, AccountUserRole, guid, Project } from '@botaiml-videoflo/entities';
import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewRegistrationDTO } from '../dto/new-registration.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(AccountUser)
    private readonly accountUserRepo: Repository<AccountUser>
  ) {}

  async registerNewAccount(newRegistrationDTO: NewRegistrationDTO): Promise<AccountUser> {
    if (newRegistrationDTO.password !== newRegistrationDTO.confirmPassword) {
      throw new UnprocessableEntityException('Password and ConfirmPassword do not match!');
    }

    newRegistrationDTO.email = newRegistrationDTO.email?.toLowerCase();

    const existingUser = await this.accountUserRepo.find({
      where: {
        username: newRegistrationDTO.email
      }
    });

    if (existingUser === null) {
      throw new ConflictException(`An account with the email id ${newRegistrationDTO.email} already exists.`);
    }

    const newAccount = await this.accountRepo.save({
      name: newRegistrationDTO.name
    });

    const newProject = await this.projectRepo.save({
      name: `${newRegistrationDTO.name}'s First Project`,
      description: `${newRegistrationDTO.name}'s First Project`,
      appId: guid(),
      secretKey: guid() + guid(),
      accountId: newAccount.id
    });

    const newUser = await this.accountUserRepo.save(
      new AccountUser({
        name: newRegistrationDTO.name,
        email: newRegistrationDTO.email,
        mobileNo: newRegistrationDTO.mobileNo,
        password: newRegistrationDTO.password,
        accountId: newAccount.id,
        projects: [newProject],
        mostRecentlyUsedProjectId: newProject.id,
        accountUserRole: AccountUserRole.customerAdmin
      })
    );

    return newUser;
  }
}
