import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@botaiml-videoflo/entities';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetch() {
    return this.http.get<User[]>('/admin-console-backend');
  }
}
