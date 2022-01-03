import { User } from '@botaiml-videoflo/entities';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetch() {
    return this.http.get<User[]>('/customer-console-backend');
  }
}
