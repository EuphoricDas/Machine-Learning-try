/* eslint-disable @typescript-eslint/no-this-alias */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ILogger, ILogService } from '../../types/logger-type';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements ILogService {
  public log;
  public LOG_FNS = [];
  public MSG_PREFIXES = [
    ['[', ']'],
    ['[', '] WARN: '],
    ['[', '] ERROR: ']
  ];

  constructor() {}

  private getLoggerFns(prefix: string) {
    this.log = window.console;
    this.LOG_FNS = [this.log.log, this.log.warn, this.log.error];
    const loggerFns = this.LOG_FNS.map((logTemplFn, i) => {
      return logTemplFn.bind(this.log, this.MSG_PREFIXES[i][0] + prefix + this.MSG_PREFIXES[i][1]);
    });
    return loggerFns;
  }

  public get(prefix: string): ILogger {
    const prodMode = environment.production;
    const loggerService = this;
    const log = this.log;

    return {
      d: function (...args: any[]) {
        if (!prodMode) {
          loggerService.getLoggerFns(prefix)[0].apply(log, args);
        }
      },
      w: function (...args: any[]) {
        loggerService.getLoggerFns(prefix)[1].apply(log, args);
      },
      e: function (...args: any[]) {
        loggerService.getLoggerFns(prefix)[2].apply(log, args);
      }
    };
  }
}
