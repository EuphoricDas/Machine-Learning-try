import { Body, Controller, Get, Logger, Post, Req } from '@nestjs/common';
import BullTasks from '../../services/bull.service';
import { HttpClientsService } from '../../services/http-client.service';
import LoggerService from '../../services/logger.service';

@Controller('bull')
export class BullController {
  constructor(
    private readonly bullService: BullTasks,
    private readonly httpClientsService: HttpClientsService,
    private readonly logger: LoggerService
  ) {}

  @Get('/')
  homeRoute() {
    return 'Kue up and running';
  }

  @Post('/add')
  async addJob(@Req() req: Request) {
    const data: any = { ...req.body };

    if (data?.body?.responseRequired) {
      this.logger.debug(`Executing job synchronously: ${data.url}`);

      const response = await this.httpClientsService.postRequest({
        url: data.url,
        data: data.body,
        key: data.key
      });
      return response;
    } else {
      this.logger.debug(`Adding new job to queue: ${data.url}`);

      const job = await this.bullService.addJob(data);
      return {
        error: false,
        id: job.id,
        message: 'Job queued'
      };
    }
  }

  @Post('/get/job')
  async getJobById(@Body() body: any) {
    const { id } = body;
    return await this.bullService.getJobById(id);
  }

  @Get('/all/jobs')
  async getAllJobs() {
    return 'in progress';
  }
}
