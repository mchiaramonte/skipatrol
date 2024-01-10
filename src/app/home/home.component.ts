import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResortData } from '../resort-data';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading: boolean = true;
  resorts: ResortData[] = [];
  lastUpdated : Date = new Date();
  
  constructor(private weather  :WeatherService, private changeRef : ChangeDetectorRef) { }

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
