const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const { kill } = require('process');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/dist/ski-patrol'));
console.log(__dirname);

let logos = [];
logos["killington"] = "assets/killington.svg";
logos["sugarbush"] = "assets/sugarbush.png"

let killington = {
    name : "Killington",
    summitTemp : 0,
    baseTemp : 0,
    openTrails : 0,
    totalTrails : 0,
    logo: logos["killington"],
    lastTwentyFour: 0,
    nextTwentyFour: 0,
    windspeed: 0,
    low: 0,
    high: 0
};

https.get("https://api.killington.com/api/v1/dor/weather", (kres) => {
    let data = '';
    kres.on('data', (chunk) => {
        data += chunk;
    });
    kres.on('end', () => {
        let weather = JSON.parse(data);
        killington.low = Math.round(weather.daily[0].temp.min);
        killington.high = Math.round(weather.daily[0].temp.max);
        killington.windspeed = Math.round(weather.current.wind_speed);
    });
});

https.get("https://api.killington.com/api/v1/dor/sensors", (kres) => {
    let data = '';

    kres.on('data', (chunk) => {
        data += chunk;
    });

    kres.on('end', () => {
        let weather = JSON.parse(data);
        let summit = weather.filter(e => e.id === "2")[0].temp;
        let base = weather.filter(e => e.id === "1")[0].temp;
        summit = summit === "Not Available" ? base : summit; 
        killington.baseTemp = base;
        killington.summitTemp = summit;
    });

});


app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));
app.get('/api/weather', (req, res) => {
    res.send([killington]);
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));