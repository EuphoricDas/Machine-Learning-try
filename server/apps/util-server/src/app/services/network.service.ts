import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
@Injectable()
export class NetworkService {
  constructor() {}

  createSignature(data: any, key: string) {
    const stringData = JSON.stringify(data);
    return crypto.createHmac('sha256', key).update(stringData).digest('base64');
  }

  async postService(data: {
    url: string;
    body: any;
    headers?: any;
    key: string;
  }): Promise<{ status?: number; headers?: any; data?: any; error: boolean; message?: string }> {
    const { url, body, headers, key } = data;
    try {
      const response = await axios({
        url,
        data: body,
        headers: {
          ...headers,
          'videoflo-signature': this.createSignature(body, key)
        },
        method: 'post'
      });

      return { error: false, status: response.status, headers: response.headers, data: response.data };
    } catch (e) {
      return { error: true, message: e.message };
    }
  }
}
