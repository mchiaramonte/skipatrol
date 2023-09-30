import { Component, OnInit } from '@angular/core';
import { ResortData } from '../resort-data';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  resorts: ResortData[] = [];
  // [{ name: 'Killington', windspeed: 0, lastTwentyFour: 0.1, nextTwentyFour: 1.3, summitTemp: -8, baseTemp: 15, logo: "assets/killington.svg", openTrails: 1, totalTrails: 10 }, 
  // { name: 'Sugarbush', windspeed: 0, lastTwentyFour: 0.1, nextTwentyFour: 1.3, summitTemp: -1,  baseTemp: 20,logo: "assets/sugarbush.png", openTrails: 3, totalTrails: 12 },
  // { name: 'Mad River Glen', windspeed: 0, lastTwentyFour: 0.1, nextTwentyFour: 1.3, summitTemp: -8,  baseTemp: 13,logo: "assets/madriverglen.png", openTrails: 5, totalTrails: 15 }, 
  // { name: 'Middlebury Snow Bowl', windspeed: 0, lastTwentyFour: 0.1, nextTwentyFour: 1.3, summitTemp: -1,  baseTemp: 27, logo: "assets/middlebury.png", openTrails: 1, totalTrails: 18 }];

  constructor(private weather  :WeatherService) { }


  ngOnInit(): void {
    console.log("Here");
    this.weather.getWeather().subscribe(data => {
      this.resorts = data;
    })
  }

}
