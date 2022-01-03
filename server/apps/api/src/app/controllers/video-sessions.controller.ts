import { OpenViduWebhookResponse } from '@botaiml-videoflo/api-interfaces';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateVideoSessionDTO, SessionDTO } from '../dto/video-session';
import { OpenViduApiService } from '../services';
import { WebhookService } from '../services/webhook.service';
import { WorkflowRepoService } from '../services/workflow-repo.service';

@Controller('videoSessions')
@ApiTags('videoSessions')
export class VideoSessionsController {
  constructor(
    private readonly workFlowRepoService: WorkflowRepoService,
    private readonly webhookService: WebhookService,
    private readonly openViduService: OpenViduApiService
  ) {}

  @ApiOperation({ operationId: 'createSession' })
  @UseGuards(JwtAuthGuard)
  @Post('createSession')
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: SessionDTO })
  async createSession(@Req() req: any, @Body() sessionInfo: CreateVideoSessionDTO) {
    const projectId = req.user.projectId;
    return this.workFlowRepoService.createSession(projectId, sessionInfo);
  }

  @ApiOperation({ operationId: 'getActivityData' })
  @UseGuards(JwtAuthGuard)
  @Get('getActivityData/:sessionId')
  // @ApiCreatedResponse({
  //   type: object
  // })
  async getActivityData(@Req() request: any) {
    const { id, data, createdOn, callEndedOn, callStartedOn } = await this.workFlowRepoService.getSessionById(
      request.params.sessionId
    );

    return { sessionId: id, data, createdOn, callEndedOn, callStartedOn };
  }

  @ApiOperation({ operationId: 'downloadCallRecording' })
  @UseGuards(JwtAuthGuard)
  @Get('downloadCallRecording/:sessionId')
  async downloadCallRecording(@Req() request: any, @Res() res: Response) {
    const { recordingStreamPipe, contentLength, contentType } = await this.openViduService.getRecordingData(
      request.params.sessionId
    );

    res.setHeader('content-type', contentType);
    res.setHeader('content-length', contentLength);

    return recordingStreamPipe.pipe(res);
  }

  @ApiExcludeEndpoint()
  @Post('webhooksHandler')
  async openViduWebhookHandler(@Body() body: OpenViduWebhookResponse) {
    const sessionId = body.sessionId;
    const sessionData = await this.workFlowRepoService.getSessionById(sessionId);

    if (body.event === 'recordingStatusChanged') {
      if (body.status === 'ready') {
        await this.webhookService.callWebhook('onRecordingAvailable', sessionData, () => body, false);
      } else if (body.status === 'error') {
        await this.webhookService.callWebhook('onRecordingError', sessionData, () => body, false);
      }
    }

    return 'ok';
  }
}
