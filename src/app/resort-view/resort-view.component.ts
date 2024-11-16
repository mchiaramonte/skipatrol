import { Component, OnInit, Input } from '@angular/core';
import { ResortData } from '../resort-data';

@Component({
  selector: 'app-resort-view',
  templateUrl: './resort-view.component.html',
  styleUrls: ['./resort-view.component.scss']
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
