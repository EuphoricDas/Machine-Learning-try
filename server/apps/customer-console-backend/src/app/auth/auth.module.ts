//import { AccountService } from '@botaiml-videoflo/common-controllers';
import {
  UsersService,
  UsersServiceModule
} from '@botaiml-videoflo/users-service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountController } from '../controllers/account.controller';
import { ProjectController } from '../controllers/project.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersServiceModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    })
  ],
  providers: [
    LocalStrategy,
    AuthService,
    UsersService,
   // AccountService,
    JwtStrategy
  ],
  controllers: [AccountController, ProjectController],
  exports: [AuthService]
})
export class AuthModule {}
