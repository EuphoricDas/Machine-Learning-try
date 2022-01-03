import {
  entities,
  requestLogCollection,
  requestLogSchema,
  VideofloSessionSchema,
  VideofloSessionsCollection
} from '@botaiml-videoflo/entities';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './configuration';
import { ClientApiController } from './controllers/client-api.controller';
import { IplookupService, OpenViduApiService, WorkflowRepoService } from './services';

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
  controllers: [ClientApiController],
  providers: [IplookupService, WorkflowRepoService, OpenViduApiService, Logger],
  exports: []
})
export class ClientApiModule {}
