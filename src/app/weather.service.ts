import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResortData } from './resort-data';
import { environment } from '../environments/environment';

export interface WeatherResponse {
  lastUpdated: string;
  weather: ResortData[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${environment.apiUrl}/api/weather`);
  }
}
