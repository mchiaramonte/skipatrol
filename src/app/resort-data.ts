import { Flags } from "./flags";

export interface ResortData {
    name: string;
    currentTemp: number;
    openTrails: number;
    totalTrails: number;
    openLifts: number;
    totalLifts: number;
    logo: string;
    nextTwentyFour: number;
    windspeed: number;
    feelsLike: number;
    low: number;
    high: number;
    flags: Flags;
}
