import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResortData } from './resort-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private https : HttpClient) { 
  }

  getWeather() {
    return this.https.get<ResortData []>(`http://${environment.production ? "localhost:4001" : "localhost:3001"}/api/weather`);
  }
}
