import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResortData } from './resort-data';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private https : HttpClient) { }

  getWeather() {
    return this.https.get<ResortData []>("/api/weather");
  }
}
