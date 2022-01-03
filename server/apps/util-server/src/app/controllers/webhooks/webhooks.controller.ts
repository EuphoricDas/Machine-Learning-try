import { HttpService } from '@nestjs/axios';
import { Body, CACHE_MANAGER, Controller, Inject, Logger, Post } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { OpenViduWebhookResponse } from '@botaiml-videoflo/api-interfaces';
import LoggerService from '../../services/logger.service';

@Controller('webhooks')
export default class WebhooksController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly http: HttpService,
    private readonly logger: LoggerService
  ) {}

  @Post('openViduWebhook')
  async openViduWebhook(@Body() body: OpenViduWebhookResponse) {
    this.logger.debug(`Received webhook from OV for session id ${body.sessionId}`);

    const url: string | null = await this.cacheManager.get(body.sessionId);

    if (url) {
      this.logger.debug(`Will forward to ${url}`);

      await this.http.post(url, body).toPromise();
    }
    return 'ok';
  }

  @Post('registerOpenViduWebhook')
  async registerOpenViduWebhook(@Body() body: { url: string; sessionID: string }) {
    this.logger.debug(`Registering OV Webhook for ${body.sessionID}: ${body.url}`);

    await this.cacheManager.set(body.sessionID, body.url);

    return {
      message: 'registered'
    };
  }
}
