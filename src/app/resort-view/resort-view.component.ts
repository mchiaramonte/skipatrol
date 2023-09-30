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
    summitTemp: 0,
    baseTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    lastTwentyFour: 0,
    nextTwentyFour: 0,
    windspeed: 0,
    logo: ""
  }
  constructor() { }

  ngOnInit(): void {
  }

}
