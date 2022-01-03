import { ProjectService } from './services/project.service';
import { entities } from '@botaiml-videoflo/entities';
import { UsersService, UsersServiceModule } from '@botaiml-videoflo/users-service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import configuration from './configuration';
import { AccountController } from './controllers/account.controller';
import { ProjectController } from './controllers/project.controller';
import { RolesGuard } from './guards/role.guard';
import { AccountService } from './services/account.service';

const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    UsersServiceModule,
    PassportModule,
    JwtModule.register(config.jwtOptions),
    TypeOrmModule.forRoot(<TypeOrmModuleOptions>config.typeOrmOptions),
    TypeOrmModule.forFeature(entities)
  ],
  controllers: [AccountController,ProjectController],
  providers: [
    AccountService,
    ProjectService,
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    LocalStrategy
  ]
})
export class AppModule {}
