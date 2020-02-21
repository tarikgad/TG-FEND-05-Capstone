let projectPosition = {};
let projectGeo = {};
let projecturl = {};
let projectWeather = {};
let projectPlace = {};
let projetTempPos = {};
let projetTempW = {};
let projetTempPix = {};

let dark = `https://api.darksky.net/forecast/`;
let pix = `https://pixabay.com/api/?image_type=photo&`;

const path = require('path');

const express = require('express');
const app = express();
app.use(express.static('dist'));

const request = require('request');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

console.log(__dirname);

app.get('/', function (req, res) {
    res.sendFile('../../dist/index.html');
});

// designates what port the app will listen to for incoming requests
const port = process.env.port;
app.listen(port, function () {
    console.log(`Capstone app listening on port ${port}!`);
});

// GET route
app.get('/call', function (req, res) {
    console.log("GET:",projectPosition);
    res.send(projectPosition);
});

// POST route
app.post('/add_position', function (req,res){
    projectPosition = req.body;
    console.log("Post position: ",projectPosition);
});

app.post('/add_geo', function (req,res){
    projectGeo = req.body;
    console.log("Post Geo: ",projectGeo);
});

app.post('/add_weather_url', function (req,res){
    projecturl = req.body;
    console.log("Post weather url: ",projecturl);
});

app.post('/add_weather', function (req,res){
    projectWeather = req.body;
    console.log("Post weather: ",projectWeather);
});

app.post('/add_place', function (req,res){
    projectPlace = req.body;
    console.log("Post Place: ",projectPlace);
});

app.get('/position', async (req, res) => {
    console.log("Get Position");
    request(
        `http://api.geonames.org/postalCodeSearchJSON?maxRows=1&username=${process.env.geonames_userid}&postalcode=${projectPosition.zipcode}&country=${projectPosition.ccode}`,
        {json: true},
        (err, res, body) => {
            projetTempPos = body;
        }
    );
    setTimeout(function(){
        res.send(projetTempPos);
    },2000);
});
    
app.get('/weather', async (req, res) => {
    console.log("Get Weather");
    request(
        `${dark}${process.env.darksky_secret_key}/${projectGeo.lat},${projectGeo.lng}${projecturl.url}`,
        {json: true},
        (err, res, body) => {
            projetTempW = body;
        }
    );
    setTimeout(function(){
        res.send(projetTempW);
    },2000);
});
    
app.get('/pix', async (req, res) => {
    console.log("Get Pix");
    request(
        `${pix}key=${process.env.pixabay_key}&q=${projectGeo.placename}+${projectPlace.countryname}`,
        {json: true},
        (err, res, body) => {
            projetTempPix = body;
        }
    );
    setTimeout(function(){
        res.send(projetTempPix);
    },2000);
});

module.exports = app;
