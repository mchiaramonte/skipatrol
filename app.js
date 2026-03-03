const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4001;

var corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost', 'http://localhost:3001', 'http://localhost:4001', 'http://localhost:4002']
};

// Middleware first
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/dist/ski-patrol/browser'));
console.log(__dirname);

let logos = [];
let lastUpdate = new Date();
logos["killington"] = "assets/killington.svg";
logos["sugarbush"] = "assets/sugarbush.png"
logos["madriverglen"] = "assets/madriverglen.png"
logos["stratton"] = "assets/stratton.png"
const strattonResortId=1;
const sugarbushResortId=70;

let killington = {
    name: "Killington",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    logo: logos["killington"],
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    flags: {
        showWind : true,
        showFeelsLike: true
    }
};

let madriverglen = {
    name: "Mad River Glen",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    logo: logos["madriverglen"],
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    flags: {
        showFeelsLike: true,
        showWind : true
    }
};

let sugarbush = {
    name: "Sugarbush",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    logo: logos["sugarbush"],
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    flags: {
        showFeelsLike: false,
        showWind: false,
    }
};

let stratton = {
    name: "Stratton",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    logo: logos["stratton"],
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    flags: {
        showFeelsLike: false,
        showWind: false,
    }
};

const emptyShared = {
    name: "",
    feelsLike: 0,
    currentTemp: 0,
    openTrails: 0,
    totalTrails: 0,
    logo: "",
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0,
    flags: {
        showFeelsLike: false,
        showWind: false,
    }
};


function processData(request, callback, rawData) {
    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });

    request.on('end', () => {
        if (!!rawData) {
            callback(data);
        }
        else {
            callback(JSON.parse(data));
        }
    });
}

function refreshData() {
    lastUpdate = new Date();

    updateKillington();
    updateShared('stratton', strattonResortId, result => {stratton = JSON.parse(JSON.stringify(result)); stratton.logo = logos["stratton"]})
    updateShared('sugarbush', sugarbushResortId, result => {sugarbush = JSON.parse(JSON.stringify(result));sugarbush.logo = logos["sugarbush"]})
    updateMadRiverGlen();

}


// API routes
app.get('/api/weather', (req, res) => {
    res.send({ lastUpdated: lastUpdate, weather: [killington, sugarbush, madriverglen, stratton] });
});

app.get('/api/health', (req, res) => {
    res.send("OK");
});

// SPA fallback — must be last so API routes are matched first
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'dist/ski-patrol/browser/index.html')));

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));

refreshData();

setInterval(refreshData, 900000);

function updateShared(resortName, resortId, handleResult) {

    https.get(`https://v4.mtnfeed.com/resorts/${resortName}.json`, r => processData(r, (requiredInfo) => {
        https.get(`https://mtnpowder.com/feed/v3.json?bearer_token=${requiredInfo.bearerToken}&resortId%5B%5D=${resortId}`, j => processData(j, (sharedData) => {
            var resortData = JSON.parse(JSON.stringify(emptyShared));
            resortData.currentTemp = sharedData.Resorts[0].CurrentConditions.Base.TemperatureF;
            resortData.high = sharedData.Resorts[0].CurrentConditions.Base.TemperatureHighF;
            resortData.low = sharedData.Resorts[0].CurrentConditions.Base.TemperatureLowF;
            resortData.totalLifts = sharedData.Resorts[0].SnowReport.TotalLifts;
            resortData.openLifts = sharedData.Resorts[0].SnowReport.TotalOpenLifts;
            resortData.totalTrails = sharedData.Resorts[0].SnowReport.TotalTrails;
            resortData.openTrails = sharedData.Resorts[0].SnowReport.TotalOpenTrails;
            resortData.nextTwentyFour = sharedData.Resorts[0].SnowReport.BaseArea.Last24HoursIn;
            resortData.windspeed = parseInt(sharedData.Resorts[0].Forecasts[0].OneDay.avewind.mph);
            handleResult(resortData);
        })).on('error', err => console.error(`mtnpowder request failed for ${resortName}:`, err));
    })).on('error', err => console.error(`mtnfeed request failed for ${resortName}:`, err));

}

function updateMadRiverGlen() {
    https.get("https://lightning.ambientweather.net/devices?public.slug=fbd46773876e89bfdad0c25c7e1352c2", r => processData(r, wdata => {
        const lastData = wdata.data[0].lastData;
        madriverglen.currentTemp = Math.round(lastData.tempf);
        madriverglen.windspeed = Math.round(lastData.windspeedmph);
        madriverglen.high = Math.round(lastData.hl.tempf.h);
        madriverglen.low = Math.round(lastData.hl.tempf.l);
        madriverglen.feelsLike = Math.round(lastData.hl.feelsLike.c / 100.0);
    })).on('error', err => console.error('Ambient Weather request failed:', err));

    https.get("https://www.madriverglen.com/conditions/", r => processData(r, data => {
        const $ = cheerio.load(data);
        $(".single_day_ticket > table > tbody > tr > td").each(function (index, td) {
            const text = $(this).text();
            const parts = text.split(": ");
            if (parts[0] === "Lifts Open Today") {
                madriverglen.openLifts = parseInt(parts[1]);
            } else if (parts[0] === "Trails Open Today") {
                madriverglen.openTrails = parseInt(parts[1]);
            } else if (parts[0] === "New Snow") {
                range = parts[1].trim().split(" - ");
                if (range.length > 1) {
                    madriverglen.nextTwentyFour = parseInt(range[1]);
                }
                else {
                    madriverglen.nextTwentyFour = parseInt(range[0]);
                }

            }

            madriverglen.totalLifts = 5;
            madriverglen.totalTrails = 60;
        });
    }, true)).on('error', err => console.error('Mad River Glen conditions request failed:', err));
}

function updateKillington() {

    https.get("https://api.killington.com/api/v1/dor/drupal/lifts", r => processData(r, lifts => {
       killington.totalLifts = lifts.length;
       killington.openLifts = lifts.filter(l => l.status !== "closed").length;
    })).on('error', err => console.error('Killington lifts request failed:', err));

    https.get("https://api.killington.com/api/v1/dor/drupal/trails", r => processData(r, trails => {
        const ftrails = trails.filter(t => t.type === "alpine_trail");
        killington.totalTrails = ftrails.length;
        killington.openTrails = ftrails.filter(t => t.status !== "closed" && t.status !== "on_hold").length;
    })).on('error', err => console.error('Killington trails request failed:', err));

    https.get("https://api.killington.com/api/v1/dor/drupal/snow-reports?sort=date&direction=desc&limit=1", r => processData(r, conditions => {
        killington.nextTwentyFour = conditions[0].computed["24_hour"];
    })).on('error', err => console.error('Killington snow report request failed:', err));

    https.get("https://api.killington.com/api/v1/dor/weather-forecast", r => processData(r, (weather) => {
        killington.low = Math.round(weather.forecast[0].temperature_low);
        killington.high = Math.round(weather.forecast[0].temperature_high);
        killington.windspeed = Math.round(weather.forecast[0].wind_speed.split("-")[0]);
        killington.currentTemp = Math.round(weather.current.temperature);
        killington.feelsLike = Math.round(weather.current.temperature);
    })).on('error', err => console.error('Killington weather request failed:', err));
}
