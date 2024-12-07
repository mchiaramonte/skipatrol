import { Component, OnInit, Input } from '@angular/core';
import { ResortData } from '../resort-data';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-resort-view',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './resort-view.component.html',
  styleUrls: ['./resort-view.component.css']
})
export class ResortViewComponent implements OnInit {
  @Input() data : ResortData = {
    name: "Resort Name Missing",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    openLifts: 0,
    totalLifts: 0,
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    logo: "",
    flags: {
      showWind: false,
      showFeelsLike: false
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
