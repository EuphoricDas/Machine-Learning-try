import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './users-service.service';

@NgModule({
  imports: [CommonModule, UsersService],
  exports: [UsersService]
})
export class UsersServiceModule {}
