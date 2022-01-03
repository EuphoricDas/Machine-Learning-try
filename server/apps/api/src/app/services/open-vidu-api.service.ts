/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { timer } from 'rxjs';
import { OpenViduRole, OpenViduSessionDTO, OpenViduSessionParameters, OpenViduTokenDTO } from '../dto/video-session';

@Injectable()
export class OpenViduApiService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private readonly logger: Logger
  ) { }

  async createSession(sessionId: string) {
    const body = {
      mediaMode: 'ROUTED',
      recordingMode: 'ALWAYS',
      customSessionId: sessionId,
      defaultOutputMode: 'COMPOSED',
      defaultRecordingLayout: 'BEST_FIT'
    };

    try {
      await this.post<OpenViduSessionDTO>('api/sessions', body);
    } catch (ex) {
      if (ex.response.status !== 409) {
        throw ex;
      }
    }
  }

  private get serverUrl(): string {
    return this.configService.get('openVidu.serverUrl');
  }

  private get authString(): string {
    if (!this['__authString']) {
      const secretKey = this.configService.get<string>('openVidu.secretKey');
      const basicAuthCredentials = Buffer.from(`OPENVIDUAPP:${secretKey}`).toString('base64');
      this['__authString'] = `Basic ${basicAuthCredentials}`;
    }

    return this['__authString'];
  }

  async endSession(videoRoomId: string): Promise<void> {
    //First stop the recording
    try {
      this.post<any>(`api/recordings/stop/${videoRoomId}`, null);
    } catch {
      //Do nothing
    }

    await timer(2000).toPromise();

    try {
      //Now close the session
      this.httpService.delete(`${this.serverUrl}/api/sessions/${videoRoomId}`, {
        headers: this.httpHeaders
      });
    } catch {
      //Do nothing
    }
  }

  async createToken(sessionParameters: OpenViduSessionParameters): Promise<OpenViduTokenDTO> {
    if (sessionParameters === null) {
      sessionParameters.role = OpenViduRole.publisher;
    }

    const body = {
      session: sessionParameters.id,
      role: sessionParameters.role,
      data: sessionParameters.data,
      kurentoOptions: sessionParameters.kurentoOptions
    };

    const response = await this.post<OpenViduTokenDTO>('api/tokens', body);

    return response.data;
  }

  private async post<T>(relativeUrl: string, body?: any): Promise<AxiosResponse<T>> {
    return await this.httpService
      .post<T>(`${this.serverUrl}/${relativeUrl}`, body, {
        headers: this.httpHeaders
      })
      .toPromise();
  }

  private get httpHeaders() {
    return {
      'Content-Type': `application/json`,
      'Authorization': `${this.authString}`
    };
  }

  async getRecordingData(sessionId: string) {
    try {
      const resp = await this.httpService
        .get(`${this.serverUrl}/openvidu/api/recordings/${sessionId}`, {
          headers: this.httpHeaders
        })
        .toPromise();

      const recordingStreamPipe = await this.httpService
        .get(resp.data?.url, {
          responseType: 'stream',
          headers: this.httpHeaders
        })
        .toPromise();

      const recordingStreamPipeHeaders = recordingStreamPipe.headers;

      return {
        recordingStreamPipe: recordingStreamPipe.data,
        contentType: recordingStreamPipeHeaders['content-type'],
        contentLength: recordingStreamPipeHeaders['content-length']
      };
    } catch (e) {
      this.logger.error("Error fetching recording data from OpenVidu", e);
    }
    return { error: true };
  }
}
