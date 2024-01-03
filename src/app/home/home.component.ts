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
  
  constructor(private weather  :WeatherService, private changeRef : ChangeDetectorRef) { }

  trackItem(index : number, item: ResortData) {
    return item.name;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.weather.getWeather().subscribe(data => {
        this.resorts = data;
        this.loading = false;
        this.changeRef.markForCheck();
      });
        
    }, 2000);

    setInterval(() => {
      this.weather.getWeather().subscribe(data => {
        this.resorts = data;
        this.loading = false;
        this.changeRef.markForCheck();
      });
    }, 3600000);
  }

}
