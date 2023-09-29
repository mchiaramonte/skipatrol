const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/dist/ski-patrol'));
console.log(__dirname);

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));
app.get('/api/weather', (req, res) => {
    return res.send("hello");
});

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`));