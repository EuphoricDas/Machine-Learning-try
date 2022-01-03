import { requestLogCollection, RequestLogDocument, VideofloSessionDocument } from '@botaiml-videoflo/entities';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';

import { WorkflowRepoService } from '.';

@Injectable()
export class WebhookService {
  constructor(
    private workflowRepoService: WorkflowRepoService,
    private configService: ConfigService,
    private http: HttpService,
    @InjectModel(requestLogCollection) private readonly requestLogService: Model<RequestLogDocument>,
    private readonly logger: Logger,
  ) { }

  /**
   * Queues the webhook request as a background job.
   *
   * @param {string} eventName name of the webhook event.
   * @param {VideofloSessionDocument} session object containing the session data.
   * @param {Function} body function that will return the body to be posted as part of the webhook call.
   * This is a function because, we do not want to create an object unnecessarily, if the webhook isn't subscribed to.
   * The function is called and body object created only if we find a subscription to the webhook.
   */
  async callWebhook(
    eventName: string,
    session: VideofloSessionDocument,
    body: () => any,
    responseRequired: boolean,
    optionalHookUrl?: string
  ): Promise<string | number> {
    if (!session) throw new NotFoundException();

    if (!session.webhooks || !session.webhooks[eventName]) return;

    let url;

    if (eventName !== 'onActivityDataGathered' && eventName !== 'onActivityAction')
      url = session.webhooks[eventName];
    else
      url = optionalHookUrl;

    // TODO: Project needs to be cached. we are hitting database every time!
    const project = await this.workflowRepoService.getProjectById(session.projectId);

    const postingData = {
      url: url,
      body: body(),
      key: `${project.appId}:${project.secretKey}`,
      responseRequired
    };

    let createdLog;

    try {
      const response = await this.http.post(this.configService.get<string>('addJobUrl'), postingData).toPromise();
      createdLog = await this.requestLogService.create({
        timestamp: new Date(),
        request: { ...postingData, key: null },
        response: { data: response.data, headers: response.headers },
        responseRequired,
        errorMessage: '',
        statusCode: response.status,
        sessionId: session.id
      });
      createdLog.save();
      return response.data.id;
    } catch (err) {
      createdLog = await this.requestLogService.create({
        timestamp: new Date(),
        request: { ...postingData, key: null },
        responseRequired,
        errorMessage: err.message,
        statusCode: 500,
        session
      });
      createdLog.save();
      this.logger.error(`Webhook Error: ${err.message}`);
    }
  }
}
