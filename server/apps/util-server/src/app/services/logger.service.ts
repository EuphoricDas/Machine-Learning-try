import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export default class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  debug(data: any) {
    this.logger.debug(data);
  }
}
