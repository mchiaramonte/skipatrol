import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ResortData } from '../resort-data';
import { WeatherService } from '../weather.service';
import { ResortViewComponent } from '../resort-view/resort-view.component';

@Component({
  selector: 'app-home',
  imports: [ResortViewComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [WeatherService]
})
export class HomeComponent implements OnInit {

  loading: boolean = true;
  resorts: ResortData[] = [];
  lastUpdated : Date = new Date();
  weather = inject(WeatherService);
  
  constructor(private changeRef : ChangeDetectorRef) { }

  trackItem(index : number, item: ResortData) {
    return item.name;
  }

  private updateData(data : any) {
    this.resorts = data.weather;
    this.loading = false;
    this.changeRef.markForCheck();
    this.lastUpdated = new Date(data.lastUpdated);
}

  ngOnInit(): void {
    setTimeout(() => {
      this.weather.getWeather().subscribe(data => this.updateData(data));
        
    }, 2000);

    setInterval(() => {
      this.weather.getWeather().subscribe(data => this.updateData(data));
    }, 3600000);
    }

}
