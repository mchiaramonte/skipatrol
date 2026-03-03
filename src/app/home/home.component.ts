import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ResortData } from '../resort-data';
import { WeatherService, WeatherResponse } from '../weather.service';
import { ResortViewComponent } from '../resort-view/resort-view.component';

@Component({
  selector: 'app-home',
  imports: [ResortViewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loading = true;
  error = false;
  resorts: ResortData[] = [];
  lastUpdated: Date = new Date();

  private weather = inject(WeatherService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    timer(2000, 3600000).pipe(
      switchMap(() =>
        this.weather.getWeather().pipe(
          catchError(err => {
            console.error('Failed to fetch weather data', err);
            this.error = true;
            this.loading = false;
            return EMPTY;
          })
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.updateData(data));
  }

  private updateData(data: WeatherResponse): void {
    this.resorts = data.weather;
    this.loading = false;
    this.error = false;
    this.lastUpdated = new Date(data.lastUpdated);
  }
}
