const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/dist/ski-patrol'));
console.log(__dirname);

let logos = [];
logos["killington"] = "assets/killington.svg";

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));
app.get('/api/weather', (req, res) => {
    https.get("https://api.killington.com/api/v1/dor/weather", (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(data);
        });

    });
    res.send([{
        name : "Killington",
        summitTemp : 0,
        baseTemp : 0,
        openTrails : 0,
        totalTrails : 0,
        logo: logos["killington"],
        lastTwentyFour: 0,
        nextTwentyFour: 0,
        windspeed: 0
    },{
        name : "Sugarbush",
        summitTemp : 0,
        baseTemp : 0,
        openTrails : 0,
        totalTrails : 0,
        logo: logos["killington"],
        lastTwentyFour: 0,
        nextTwentyFour: 0,
        windspeed: 0
    }]);
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));