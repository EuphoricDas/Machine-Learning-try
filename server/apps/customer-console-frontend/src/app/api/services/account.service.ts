/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AuthenticatedAccountUserDto } from '../models/authenticated-account-user-dto';
import { LoginDto } from '../models/login-dto';
import { NewRegistrationDto } from '../models/new-registration-dto';
import { UpdateMru } from '../models/update-mru';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation registerNewAccount
   */
  static readonly RegisterNewAccountPath = '/customer-console-backend/account/registerNewAccount';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerNewAccount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewAccount$Response(params: {
    body: NewRegistrationDto
  }): Observable<StrictHttpResponse<AuthenticatedAccountUserDto>> {

    const rb = new RequestBuilder(this.rootUrl, AccountService.RegisterNewAccountPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticatedAccountUserDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registerNewAccount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewAccount(params: {
    body: NewRegistrationDto
  }): Observable<AuthenticatedAccountUserDto> {

    return this.registerNewAccount$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticatedAccountUserDto>) => r.body as AuthenticatedAccountUserDto)
    );
  }

  /**
   * Path part for operation login
   */
  static readonly LoginPath = '/customer-console-backend/account/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login$Response(params: {
    body: LoginDto
  }): Observable<StrictHttpResponse<AuthenticatedAccountUserDto>> {

    const rb = new RequestBuilder(this.rootUrl, AccountService.LoginPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticatedAccountUserDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `login$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  login(params: {
    body: LoginDto
  }): Observable<AuthenticatedAccountUserDto> {

    return this.login$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticatedAccountUserDto>) => r.body as AuthenticatedAccountUserDto)
    );
  }

  /**
   * Path part for operation updateMru
   */
  static readonly UpdateMruPath = '/customer-console-backend/account/updateMru';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateMru()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateMru$Response(params: {
    body: UpdateMru
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AccountService.UpdateMruPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateMru$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateMru(params: {
    body: UpdateMru
  }): Observable<void> {

    return this.updateMru$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
