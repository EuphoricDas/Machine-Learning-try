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
import { TokenService } from '../../services/token.service';

import { ApiTokenResponseDto } from '../models/api-token-response-dto';
import { CompareFacesRequestDto } from '../models/compare-faces-request-dto';
import { CompareFacesResultDto } from '../models/compare-faces-result-dto';
import { CoordinatesDto } from '../models/coordinates-dto';
import { GeocodingResultsDto } from '../models/geocoding-results-dto';
import { IpLookupResponseDto } from '../models/ip-lookup-response-dto';
import { MatchHeadPoseRequestDto } from '../models/match-head-pose-request-dto';
import { MatchHeadPoseResultDto } from '../models/match-head-pose-result-dto';
import { PanRecognitionRequestDto } from '../models/pan-recognition-request-dto';
import { PanRecognitionResponseDto } from '../models/pan-recognition-response-dto';
import { ParticipantDto } from '../models/participant-dto';
import { ParticipantQuery } from '../models/participant-query';
import { ParticipantRequestInfoDto } from '../models/participant-request-info-dto';

@Injectable({
  providedIn: 'root',
})
export class ClientApiService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient,
    private tokenService: TokenService
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getWsToken
   */
  static readonly GetWsTokenPath = '/clientApi/getWsToken';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getWsToken()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getWsToken$Response(params: {
    body: ParticipantRequestInfoDto
  }): Observable<StrictHttpResponse<ApiTokenResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.GetWsTokenPath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApiTokenResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getWsToken$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getWsToken(params: {
    body: ParticipantRequestInfoDto
  }): Observable<ApiTokenResponseDto> {

    return this.getWsToken$Response(params).pipe(
      map((r: StrictHttpResponse<ApiTokenResponseDto>) => r.body as ApiTokenResponseDto)
    );
  }

  /**
   * Path part for operation getGeocodeLocation
   */
  static readonly GetGeocodeLocationPath = '/clientApi/getGeocodeLocation';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getGeocodeLocation()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getGeocodeLocation$Response(params: {
    body: CoordinatesDto
  }): Observable<StrictHttpResponse<GeocodingResultsDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.GetGeocodeLocationPath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GeocodingResultsDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getGeocodeLocation$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getGeocodeLocation(params: {
    body: CoordinatesDto
  }): Observable<GeocodingResultsDto> {

    return this.getGeocodeLocation$Response(params).pipe(
      map((r: StrictHttpResponse<GeocodingResultsDto>) => r.body as GeocodingResultsDto)
    );
  }

  /**
   * Path part for operation getCustomerIpInfo
   */
  static readonly GetCustomerIpInfoPath = '/clientApi/getCustomerIpInfo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCustomerIpInfo()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerIpInfo$Response(params?: {
  }): Observable<StrictHttpResponse<IpLookupResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.GetCustomerIpInfoPath, 'get', this.tokenService);
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<IpLookupResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCustomerIpInfo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerIpInfo(params?: {
  }): Observable<IpLookupResponseDto> {

    return this.getCustomerIpInfo$Response(params).pipe(
      map((r: StrictHttpResponse<IpLookupResponseDto>) => r.body as IpLookupResponseDto)
    );
  }

  /**
   * Path part for operation getParticipantInfo
   */
  static readonly GetParticipantInfoPath = '/clientApi/getParticipantInfo';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getParticipantInfo()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getParticipantInfo$Response(params: {
    body: ParticipantQuery
  }): Observable<StrictHttpResponse<ParticipantDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.GetParticipantInfoPath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ParticipantDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getParticipantInfo$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getParticipantInfo(params: {
    body: ParticipantQuery
  }): Observable<ParticipantDto> {

    return this.getParticipantInfo$Response(params).pipe(
      map((r: StrictHttpResponse<ParticipantDto>) => r.body as ParticipantDto)
    );
  }

  /**
   * Path part for operation compareFaces
   */
  static readonly CompareFacesPath = '/clientApi/compareFaces';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `compareFaces()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  compareFaces$Response(params: {
    body: CompareFacesRequestDto
  }): Observable<StrictHttpResponse<CompareFacesResultDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.CompareFacesPath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CompareFacesResultDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `compareFaces$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  compareFaces(params: {
    body: CompareFacesRequestDto
  }): Observable<CompareFacesResultDto> {

    return this.compareFaces$Response(params).pipe(
      map((r: StrictHttpResponse<CompareFacesResultDto>) => r.body as CompareFacesResultDto)
    );
  }

  /**
   * Path part for operation panRecognition
   */
  static readonly PanRecognitionPath = '/clientApi/panRecognition';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `panRecognition()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  panRecognition$Response(params: {
    body: PanRecognitionRequestDto
  }): Observable<StrictHttpResponse<PanRecognitionResponseDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.PanRecognitionPath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PanRecognitionResponseDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `panRecognition$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  panRecognition(params: {
    body: PanRecognitionRequestDto
  }): Observable<PanRecognitionResponseDto> {

    return this.panRecognition$Response(params).pipe(
      map((r: StrictHttpResponse<PanRecognitionResponseDto>) => r.body as PanRecognitionResponseDto)
    );
  }

  /**
   * Path part for operation matchHeadPose
   */
  static readonly MatchHeadPosePath = '/clientApi/matchHeadPose';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `matchHeadPose()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  matchHeadPose$Response(params: {
    body: MatchHeadPoseRequestDto
  }): Observable<StrictHttpResponse<MatchHeadPoseResultDto>> {

    const rb = new RequestBuilder(this.rootUrl, ClientApiService.MatchHeadPosePath, 'post', this.tokenService);
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MatchHeadPoseResultDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `matchHeadPose$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  matchHeadPose(params: {
    body: MatchHeadPoseRequestDto
  }): Observable<MatchHeadPoseResultDto> {

    return this.matchHeadPose$Response(params).pipe(
      map((r: StrictHttpResponse<MatchHeadPoseResultDto>) => r.body as MatchHeadPoseResultDto)
    );
  }

}
