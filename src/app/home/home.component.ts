import { Component, OnInit } from '@angular/core';
import { ResortData } from '../resort-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  resorts: ResortData[] = 
  [{ name: 'Killington', peakTemp: -8, logo: "assets/killington.svg" }, 
  { name: 'Sugarbush', peakTemp: -1, logo: "assets/sugarbush.png" },
  { name: 'Mt Snow', peakTemp: -8, logo: "assets/mountsnow.png" }, 
  { name: 'Bromley', peakTemp: -1, logo: "assets/bromley.svg" },
  { name: 'Sunday River', peakTemp: -1, logo: "assets/sundayriver.svg" }];

  constructor() { }


  ngOnInit(): void {
  }

}
