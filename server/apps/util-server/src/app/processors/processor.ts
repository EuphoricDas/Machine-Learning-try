import { DoneCallback, Job } from 'bull';
import axios from 'axios';
import * as crypto from 'crypto';

const createSignature = (data: any, key: string): string => {
  const stringData = JSON.stringify(data);
  return crypto.createHmac('sha256', key).update(stringData).digest('base64');
};

export default async (job: Job, callback: DoneCallback) => {
  const { url, body, key } = job.data;
  try {
    console.log(`Executing job in background: ${url}`);

    await axios({
      method: 'post',
      url,
      data: body,
      headers: {
        'videoflo-signature': createSignature(body, key)
      }
    });
    callback(null, 'works');
  } catch (e) {
    callback(new Error(e.message), 'not works');
  }
};
