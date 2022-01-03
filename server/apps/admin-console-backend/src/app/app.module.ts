import { CommonControllersModule } from '@botaiml-videoflo/common-controllers';
import { entities } from '@botaiml-videoflo/entities';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import configuration from './configuration';
import { AccountController } from './controllers/account.controller';
import { HomeController } from './controllers/home.controller';
import { RolesGuard } from './guards/roles.guard';

const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    TypeOrmModule.forRoot(<TypeOrmModuleOptions>config.typeOrmOptions),
    TypeOrmModule.forFeature(entities),
    AuthModule,
    CommonControllersModule
  ],
  controllers: [AccountController, HomeController],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
