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

import { PaginationAndSort } from '../models/pagination-and-sort';
import { ProjectAddUpdateDto } from '../models/project-add-update-dto';
import { ProjectInfoDto } from '../models/project-info-dto';
import { ProjectPaginatedAndSortedResult } from '../models/project-paginated-and-sorted-result';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getAllProjects
   */
  static readonly GetAllProjectsPath = '/customer-console-backend/project/getAllProjects';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllProjects()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getAllProjects$Response(params: {
    body: PaginationAndSort
  }): Observable<StrictHttpResponse<ProjectPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.GetAllProjectsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ProjectPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllProjects$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getAllProjects(params: {
    body: PaginationAndSort
  }): Observable<ProjectPaginatedAndSortedResult> {

    return this.getAllProjects$Response(params).pipe(
      map((r: StrictHttpResponse<ProjectPaginatedAndSortedResult>) => r.body as ProjectPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation create
   */
  static readonly CreatePath = '/customer-console-backend/project/create';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params: {
    body: ProjectAddUpdateDto
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.CreatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params: {
    body: ProjectAddUpdateDto
  }): Observable<number> {

    return this.create$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation update
   */
  static readonly UpdatePath = '/customer-console-backend/project/update';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update$Response(params: {
    body: ProjectAddUpdateDto
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.UpdatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `update$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update(params: {
    body: ProjectAddUpdateDto
  }): Observable<number> {

    return this.update$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation deleteProject
   */
  static readonly DeleteProjectPath = '/customer-console-backend/project/delete/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProject()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProject$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.DeleteProjectPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
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
   * To access the full response (for headers, for example), `deleteProject$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProject(params: {
    id: number;
  }): Observable<void> {

    return this.deleteProject$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getProjectById
   */
  static readonly GetProjectByIdPath = '/customer-console-backend/project/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProjectById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectById$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<ProjectInfoDto>> {

    const rb = new RequestBuilder(this.rootUrl, ProjectService.GetProjectByIdPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ProjectInfoDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getProjectById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectById(params: {
    id: number;
  }): Observable<ProjectInfoDto> {

    return this.getProjectById$Response(params).pipe(
      map((r: StrictHttpResponse<ProjectInfoDto>) => r.body as ProjectInfoDto)
    );
  }

}
