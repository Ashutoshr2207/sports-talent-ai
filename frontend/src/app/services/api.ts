import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Athlete {
  id?: number;
  name: string;
  age: number;
  gender: string;
  sport: string;
  height: number;
  weight: number;
  speed_score: number;
  strength_score: number;
  endurance_score: number;
  created_at?: string;
}

export interface AthleteAnalysis {
  athlete_id: number;
  athlete_name: string;
  performance_rating: string;
  average_score: number;
  speed_score: number;
  strength_score: number;
  endurance_score: number;
  recommendations: string[];
}

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

  // Athlete endpoints
  getAthletes(): Observable<{athletes: Athlete[], count: number}> {
    return this.http.get<{athletes: Athlete[], count: number}>(`${this.baseUrl}/athletes`);
  }

  createAthlete(athlete: Athlete): Observable<{message: string, athlete: Athlete}> {
    return this.http.post<{message: string, athlete: Athlete}>(`${this.baseUrl}/athletes`, athlete);
  }

  getAthlete(id: number): Observable<{athlete: Athlete}> {
    return this.http.get<{athlete: Athlete}>(`${this.baseUrl}/athletes/${id}`);
  }

  getAthleteAnalysis(id: number): Observable<{analysis: AthleteAnalysis}> {
    return this.http.get<{analysis: AthleteAnalysis}>(`${this.baseUrl}/analysis/${id}`);
  }

}
