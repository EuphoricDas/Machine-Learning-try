import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParticipantConnectionStatusModel } from './models/participant-connection-status.model';
import { WorkflowDataWebhookModel } from './models/workflow-data-webhook-model';
import { WorkflowStepDataWebhookModel } from './models/workflow-step-data';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly appService: WebhookService) {}

  @Post('onParticipantConnected')
  onParticipantConnected(
    @Body() payload: ParticipantConnectionStatusModel,
    @Req() request: Request,
  ): string {
    return this.appService.processWebhook(
      'onParticipantConnected',
      payload,
      request,
    );
  }

  @Post('onParticipantDisconnected')
  onParticipantDisconnected(
    @Body() payload: ParticipantConnectionStatusModel,
    @Req() request: Request,
  ): string {
    return this.appService.processWebhook(
      'onParticipantDisconnected',
      payload,
      request,
    );
  }

  @Post('onActivityDataGathered')
  onActivityDataGathered(
    @Body() payload: WorkflowStepDataWebhookModel,
    @Req() request: Request,
  ): string {
    return this.appService.processWebhook(
      'onActivityDataGathered',
      payload,
      request,
    );
  }

  @Post('onActivityAction')
  onActivityAction(
    @Body() payload: WorkflowStepDataWebhookModel,
    @Req() request: Request,
  ): string {
    return this.appService.processWebhook('onActivityAction', payload, request);
  }

  @Post('onWorkflowFinished')
  onWorkflowFinished(
    @Body() payload: WorkflowDataWebhookModel,
    @Req() request: Request,
  ): string {
    return this.appService.processWebhook(
      'onWorkflowFinished',
      payload,
      request,
    );
  }

  @Post('onRecordingAvailable')
  onRecordingAvailable(@Body() payload: any, @Req() request: Request): string {
    return this.appService.processWebhook(
      'onRecordingAvailable',
      payload,
      request,
    );
  }

  @Post('onRecordingError')
  onRecordingError(@Body() payload: any, @Req() request: Request): string {
    return this.appService.processWebhook('onRecordingError', payload, request);
  }
}
