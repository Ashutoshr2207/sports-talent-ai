import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getMessage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/message`);
  }

  uploadVideo(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, data);
  }

}
