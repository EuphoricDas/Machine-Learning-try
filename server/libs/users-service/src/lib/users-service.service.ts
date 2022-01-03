import { NgModule } from '@angular/core';
import { User } from '@botaiml-videoflo/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity

@NgModule()
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.userRepo.findOne({
      where: {
        email
      }
    });
  }
}
