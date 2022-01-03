import { Injectable } from '@nestjs/common';
import { UsersService } from '@botaiml-videoflo/users-service';
import { AccountUser, AccountUserRole } from '@botaiml-videoflo/entities';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedAccountUserDTO } from '../dto/authenticated-account-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountUser)
    private readonly accountUserRepo: Repository<AccountUser>,
    private jwtService: JwtService
  ) {}

  async authenticateUser(username: string, password: string): Promise<AuthenticatedAccountUserDTO> {
    const accountUser = await this.accountUserRepo.findOne({
      where: {
        username: username
      },
      relations: ['account', 'projects']
    });

    const token = this.createToken(
      accountUser.id,
      accountUser.name,
      accountUser.accountUserRole,
      accountUser.accountId
    );

    const retVal = new AuthenticatedAccountUserDTO({
      id: accountUser.id,
      name: accountUser.name,
      accountId: accountUser.accountId,
      accountName: accountUser.account.name,
      role: accountUser.accountUserRole,
      projects: accountUser.projects,
      mostRecentlyUsedProject: accountUser.mostRecentlyUsedProjectId,
      token: token
    });

    return retVal;
  }

  private createToken(id: number, name: string, role: AccountUserRole, accountId: number): string {
    const payload = {
      id: id,
      name: name,
      role: role,
      accountId: accountId
    };
    return this.jwtService.sign(payload);
  }
}