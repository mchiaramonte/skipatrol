const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const { kill } = require('process');
const cheerio = require('cheerio');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/dist/ski-patrol'));
console.log(__dirname);

let logos = [];
logos["killington"] = "assets/killington.svg";
logos["sugarbush"] = "assets/sugarbush.png"
logos["madriverglen"] = "assets/madriverglen.png"

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
    high: 0
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
    high: 0
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
    high: 0
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
    https.get("https://api.killington.com/api/v1/dor/weather", r => processData(r, (weather) => {
        killington.low = Math.round(weather.daily[0].temp.min);
        killington.high = Math.round(weather.daily[0].temp.max);
        killington.windspeed = Math.round(weather.current.wind_speed);
        killington.currentTemp = Math.round(weather.current.temp);
        killington.feelsLike = Math.round(weather.current.feels_like);
    }));

    https.get("https://v4.mtnfeed.com/resorts/sugarbush.json", r => processData(r, (requiredInfo) => {
        https.get(`https://mtnpowder.com/feed/v3.json?bearer_token=${requiredInfo.bearerToken}&resortId%5B%5D=70`, j => processData(j, (sbdata) => {
            sugarbush.currentTemp = sbdata.Resorts[0].CurrentConditions.Base.TemperatureF
            sugarbush.high = sbdata.Resorts[0].CurrentConditions.Base.TemperatureHighF;
            sugarbush.low = sbdata.Resorts[0].CurrentConditions.Base.TemperatureLowF
            sugarbush.totalLifts = sbdata.Resorts[0].SnowReport.TotalLifts;
            sugarbush.openLifts = sbdata.Resorts[0].SnowReport.TotalOpenLifts;
            sugarbush.totalTrails = sbdata.Resorts[0].SnowReport.TotalTrails;
            sugarbush.openTrails = sbdata.Resorts[0].SnowReport.TotalOpenLifts;

        }))
    }));

    https.get("https://lightning.ambientweather.net/devices?public.slug=701991bf51eed258385b8d3e2c86f2d6", r => processData(r, wdata => {
        const lastData = wdata.data[0].lastData;
        madriverglen.currentTemp = Math.round(lastData.tempf);
        madriverglen.windspeed = Math.round(lastData.windspeedmph);
        madriverglen.high = Math.round(lastData.hl.tempf.h);
        madriverglen.low = Math.round(lastData.hl.tempf.l);
        madriverglen.feelsLike = Math.round(lastData.hl.feelsLike.c / 100.0);

    }));

    https.get("https://www.madriverglen.com/conditions/", r => processData(r, data => {
        const $ = cheerio.load(data);
        $(".single_day_ticket > table > tbody > tr > td").each(function (index, td) {
            const text = $(this).text();
            const parts = text.split(": ");
            if (parts[0] === "Lifts Open Today") {
                madriverglen.openLifts = parseInt(parts[1]);
            }
            madriverglen.totalLifts = 4;
            madriverglen.totalTrails = 60;
        });
    }, true));

    https.get("https://api.killington.com/api/v1/dor/conditions", r => processData(r, conditions => {
        killington.openTrails = conditions.trailReport.open;
        killington.totalTrails = conditions.trailReport.total;
        killington.openLifts = conditions.liftReport.open;
        killington.totalLifts = conditions.liftReport.total;
        killington.nextTwentyFour = conditions.snowReport[0].items.filter(si => si.duration === "24 Hours")[0].amount;
    }));


}


app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));
app.get('/api/weather', (req, res) => {
    res.send([killington, sugarbush, madriverglen]);
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));

refreshData();

setInterval(refreshData, 900000);