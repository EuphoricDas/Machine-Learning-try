import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullController } from './controllers/bull/bull.controller';
import WebhooksController from './controllers/webhooks/webhooks.controller';
import BullProcessor from './processors/processor';
import BullTasks from './services/bull.service';
import { HttpClientsService } from './services/http-client.service';
import { NetworkService } from './services/network.service';
import configuration from './configuration';
import * as redisStore from 'cache-manager-redis-store';
import LoggerService from './services/logger.service';
const config = configuration();

@Module({
  imports: [
    HttpModule,
    CacheModule.register({ store: redisStore, host: 'localhost', port: 6379, ttl: 60 * 36000 * 1000 }),
    BullModule.registerQueue({
      name: 'videoflo',
      redis: {
        host: 'localhost',
        port: 6379
      },
      processors: [BullProcessor]
    })
  ],
  controllers: [AppController, BullController, WebhooksController],
  providers: [AppService, BullTasks, NetworkService, HttpClientsService, LoggerService]
})
export class AppModule {}
