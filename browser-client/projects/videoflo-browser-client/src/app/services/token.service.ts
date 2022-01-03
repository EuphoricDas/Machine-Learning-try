import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  public get token(): string {
    return localStorage.getItem('at');
  }

  public set token(value: string) {
    localStorage.setItem('at', value);
  }

  public get isTokenValid(): boolean {
    const token = this.token;

    if (token) {
      const tokenInfo = new AuthTokenInfo(token);
      const now = new Date();

      return (
        tokenInfo && tokenInfo.issuedAt <= now && tokenInfo?.expiresAt >= now
      );
    }

    return false;
  }
}

class AuthTokenInfo {
  constructor(token: string) {
    const decoded = jwt_decode(token) as any;

    this.token = token;
    this.id = decoded.nameid;
    this.name = decoded.unique_name;
    this.expiresAt = new Date(decoded.exp * 1000);
    this.issuedAt = new Date(decoded.iat * 1000);
  }

  token: string;
  id: string;
  name: string;
  expiresAt: Date;
  issuedAt: Date;
}
