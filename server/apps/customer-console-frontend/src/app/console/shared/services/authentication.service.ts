import { AuthenticatedAccountUserDto } from './../../../api/models/authenticated-account-user-dto';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from '../../../api/services';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthenticatedAccountUserDto>;
  public currentUser: Observable<AuthenticatedAccountUserDto>;

  constructor(private accountService: AccountService) {
    let userFromLS: AuthenticatedAccountUserDto = null;

    let userStr = localStorage.getItem('currentUser');

    if (userStr) {
      try {
        userFromLS = JSON.parse(userStr);
      } catch {
        // Do nothing. Probably invalid JSON
      }
    }

    this.currentUserSubject = new BehaviorSubject<AuthenticatedAccountUserDto>(userFromLS);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticatedAccountUserDto {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    if (!this.currentUserValue)
      return false;
    return this.isTokenValid;
  }

  private ensureTokenDecoded() {
    if (this._token !== null || this.currentUserValue == null) return;

    this._token = jwt_decode(this.currentUserValue.token);
  }

  private _token: any = null;

  public get isTokenValid(): boolean {
    this.ensureTokenDecoded();

    if (this._token !== null) {
      const notBefore = new Date(this._token.iat * 1000);
      const notAfter = new Date(this._token.exp * 1000);

      const curDateTime = new Date();

      return (curDateTime > notBefore && curDateTime < notAfter);
    }

    return false;
  }

  async login(username: string, password: string) {
    const user = await this.accountService.login({
      body: { username, password }
    }).toPromise();

    this.setUserToken(user);

    return user;
  }

  setUserToken(user) {
    // login successful if there's a jwt token in the response
    if (user && user.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  logout(router: Router) {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

    if (router)
      router.navigate(["/console", "login"]);
  }
}
