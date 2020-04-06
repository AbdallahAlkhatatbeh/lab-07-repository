'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get('/', (request, response) => {
  response.send('Home Page!');
});

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

// Route Handlers

function locationHandler(request, response) {
  // try {
  //   const geoData = require('./data/geo.json');
  //   const city = request.query.city;
  //   const locationData = new Location(city, geoData);
  //   console.log(locationData);
  //   response.status(200).send(locationData);
  // } catch (error) {
  //   errorHandler(
  //     'an error happened while fetching your data!\n' + error,
  //     request,
  //     response
  //   );
  // }
  const city = request.query.city;
  superagent(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`
  )
    .then((res) => {
      const geoData = res.body;
      const locationData = new Location(city, geoData);
      response.status(200).json(locationData);
    })
    .catch((err) => errorHandler(err, request, response));
}

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function weatherHandler(request, response) {
  // try {
  //   const weatherRes = require('./data/darksky.json');
  //   const weatherSummaries = weatherRes.data.map((day) => {
  //     return new Weather(day);
  //   });
  //   response.status(200).json(weatherSummaries);
  // } catch (error) {
  //   errorHandler(
  //     'So sorry, something went wrong with weather.',
  //     request,
  //     response
  //   );
  // }
  superagent(
    `https://api.weatherbit.io/v2.0/forecast/daily?city=${request.query.search_query}&key=${process.env.WEATHER_API_KEY}`
  )
    .then((weatherRes) => {
      console.log(weatherRes);
      const weatherSummaries = weatherRes.body.data.map((day) => {
        return new Weather(day);
      });
      response.status(200).json(weatherSummaries);
    })
    .catch((err) => errorHandler(err, request, response));
}

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = new Date(day.valid_date).toString().slice(0, 15);
}
// function trailHandler(request, response) {
//   superagent(
//     `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=${process.env.TRAIL_API_KEY}`
//   )
//     .then((road) => {
//       const geoData = road.body;
//       const locationData = new Location(city, geoData);
//       response.status(200).json(locationData);

//     });
// [
//     {
//       "name": "Rattlesnake Ledge",
//       "location": "Riverbend, Washington",
//       "length": "4.3",
//       "stars": "4.4",
//       "star_votes": "84",
//       "summary": "An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.",
//       "trail_url": "https://www.hikingproject.com/trail/7021679/rattlesnake-ledge",
//       "conditions": "Dry: The trail is clearly marked and well maintained.",
//       "condition_date": "2018-07-21",
//       "condition_time": "0:00:00 "
//     },

// }
// function Trail(go){
//  this.name=go.
// }


function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
