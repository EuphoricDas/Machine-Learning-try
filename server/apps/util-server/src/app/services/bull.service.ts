import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

@Injectable()
export default class BullTasks {
  constructor(@InjectQueue('videoflo') private videoFloQueue: Queue) {}

  async addJob(data: any = {}): Promise<Job> {
    return await this.videoFloQueue.add(data);
  }

  async getJobById(id: string) {
    return this.videoFloQueue.getJob(id);
  }

  async getAllJobs() {}
}
