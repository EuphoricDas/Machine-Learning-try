import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HttpClientsService {
  createSignature(data: any, key: string): string {
    const stringData = JSON.stringify(data);
    return crypto.createHmac('sha256', key).update(stringData).digest('base64');
  }
  async postRequest(data: { url: string; data: any; key: string }): Promise<any> {
    const response = await axios({
      method: 'post',
      data: data.data,
      headers: {
        'videoflo-signature': this.createSignature(data.data, data.key)
      },
      url: data.url
    });

    return response.data;
  }
}
