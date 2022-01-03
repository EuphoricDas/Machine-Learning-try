import {
  entities,
  requestLogCollection,
  requestLogSchema,
  VideofloSessionSchema,
  VideofloSessionsCollection
} from '@botaiml-videoflo/entities';
import { UsersService } from '@botaiml-videoflo/users-service';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import configuration from './configuration';
import { TokenController } from './controllers/token.controller';
import { VideoSessionsController } from './controllers/video-sessions.controller';
import { OpenViduApiService, WorkflowRepoService } from './services';
import { WebhookService } from './services/webhook.service';

const config = configuration();

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    JwtModule.register(config.jwtOptions),
    TypeOrmModule.forFeature(entities),
    MongooseModule.forFeature([
      { name: VideofloSessionsCollection, schema: VideofloSessionSchema },
      { schema: requestLogSchema, name: requestLogCollection }
    ])
  ],
  controllers: [TokenController, VideoSessionsController],
  providers: [AuthService, UsersService, WorkflowRepoService, WebhookService, OpenViduApiService, Logger],
  exports: []
})
export class RestApiModule {}
