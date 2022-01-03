import { AccountUser, LoginDTO } from '@botaiml-videoflo/entities';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { NewRegistrationDTO } from '../dto/new-registration.dto';
import { AccountService } from '../services/account.service';
import { AuthenticatedAccountUserDTO } from './../dto/authenticated-account-user.dto';
import { UpdateMru } from './../dto/updateMru.dto';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private accountService: AccountService, private authService: AuthService,@InjectRepository(AccountUser)
  private readonly accountUserRepo: Repository<AccountUser>,) {}

  @ApiOperation({ operationId: 'registerNewAccount', tags: ['rest'] })
  @Post('registerNewAccount')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: AuthenticatedAccountUserDTO
  })
  async registerNewAccount(@Body() newRegistrationDTO: NewRegistrationDTO) {
    const newUser: AccountUser = await this.accountService.registerNewAccount(newRegistrationDTO);

    return await this.authService.authenticateUser(
      newUser.username,
      // password in newUser object is already encrypted at this point. So we use the value from DTO.
      newRegistrationDTO.password
    );
  }

  @ApiOperation({ operationId: 'login', tags: ['rest'] })
  @Post('login')
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: AuthenticatedAccountUserDTO
  })
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.authenticateUser(loginDTO.username, loginDTO.password);
  }

  @ApiOperation({ operationId: 'updateMru', tags: ['rest'] })
  @Post('updateMru')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  async updateMru(@Body() updateMru:UpdateMru){
    const accId = updateMru.accId
    const user = await this.accountUserRepo.findOne({
      where:{
        accountId:accId
      },
      relations:['projects']
    })
    user.mostRecentlyUsedProjectId = updateMru.projectId
    this.accountUserRepo.save(user)
    return
  }
}
