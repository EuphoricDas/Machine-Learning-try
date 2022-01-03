import { Injectable } from '@angular/core';
import { LocalUsersService } from '../local-users/local-users.service';
import { AvatarType } from '../../types/chat-type';
import { user_avatar } from '../../shared/images';

@Injectable({
  providedIn: 'root'
})
export class AvatarServiceMock {
  private openviduAvatar = user_avatar;
  private capturedAvatar = '';

  constructor() { }

  setCaputedAvatar(avatar: string) { }

  setFinalAvatar(type: AvatarType) { }

  getOpenViduAvatar(): string {
    return this.openviduAvatar;
  }
  getCapturedAvatar(): string {
    return this.capturedAvatar;
  }

  createCapture(): string {
    return '';
  }

  getAvatarFromConnectionData(data: string): string {
    return '';
  }

  clear() { }
}
