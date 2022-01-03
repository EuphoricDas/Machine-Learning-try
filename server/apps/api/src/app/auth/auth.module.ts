import { entities } from '@botaiml-videoflo/entities';
import { UsersService, UsersServiceModule } from '@botaiml-videoflo/users-service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../configuration';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

const config = configuration();

@Module({
  imports: [
    UsersServiceModule,
    PassportModule,
    JwtModule.register(config.jwtOptions),
    TypeOrmModule.forFeature(entities)
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
