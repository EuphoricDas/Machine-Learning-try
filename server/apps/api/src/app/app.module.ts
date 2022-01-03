import {
  entities,
  requestLogCollection,
  requestLogSchema,
  VideofloSessionSchema,
  VideofloSessionsCollection
} from '@botaiml-videoflo/entities';
import { UsersService, UsersServiceModule } from '@botaiml-videoflo/users-service';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { ClientApiModule } from './client-api.module';
import configuration from './configuration';
import { ClientApiController } from './controllers/client-api.controller';
import { TokenController } from './controllers/token.controller';
import { VideoSessionsController } from './controllers/video-sessions.controller';
import { WorkflowGateway } from './controllers/workflow.gateway';
import { RolesGuard } from './guards/roles.guard';
import { RestApiModule } from './rest-api.module';
import { IplookupService } from './services/iplookup.service';
import { OpenViduApiService } from './services/open-vidu-api.service';
import { RequestLoggerService } from './services/request-logger.service';
import { WebhookService } from './services/webhook.service';
import { WorkflowRepoService } from './services/workflow-repo.service';

const config = configuration();

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    JwtModule.register(config.jwtOptions),
    TypeOrmModule.forRoot(<TypeOrmModuleOptions>config.typeOrmOptions),
    TypeOrmModule.forFeature(entities),
    MongooseModule.forRoot(config.mongoDb.url, config.mongoDb.options),
    MongooseModule.forFeature([
      { name: VideofloSessionsCollection, schema: VideofloSessionSchema },
      { schema: requestLogSchema, name: requestLogCollection }
    ]),
    AuthModule,
    UsersServiceModule,
    HttpModule,
    RestApiModule,
    ClientApiModule
  ],
  controllers: [],
  providers: [
    Logger,
    LocalStrategy,
    AuthService,
    UsersService,
    WebhookService,
    OpenViduApiService,
    WorkflowRepoService,
    IplookupService,
    WorkflowGateway,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [AuthService, JwtModule]
})
export class AppModule {}
