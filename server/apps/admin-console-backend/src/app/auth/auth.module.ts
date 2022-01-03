import { UsersService, UsersServiceModule } from '@botaiml-videoflo/users-service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from '../configuration';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

const config = configuration();

@Module({
  imports: [UsersServiceModule, PassportModule, JwtModule.register(config.jwtOptions)],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
  exports: [AuthService]
})
export class AuthModule {}
