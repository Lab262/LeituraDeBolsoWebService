//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages
const express    = require('express');
const app        = express();
const environment = require('./config/environment'); // get our config file
const db = require('./config/db');
//Configure app to user bodyParse()
//this will let use get the data from a post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('superSecret', environment.secret); // secret variable

var morgan      = require('morgan');
app.use(morgan('dev'));
//Router setup
var ROUTES = {'Readings':'/readings','Users':'/users','User-Readings':'/user-readings'};
var VERSIONS = {'Pre-Production': '/v0'};
for (var versionIndex in VERSIONS) {
  for (var currentRouteIndex in ROUTES) {
    app.use('/api' + VERSIONS[versionIndex], require('./routes' + VERSIONS[versionIndex] + ROUTES[currentRouteIndex]));
  }
}

//Midleware
app.use(function(err, req, res, next) {
  if (err){
    return res.json({message: 'Error', error: err})
  }
});


module.exports = app;

//Service setup
var port = process.env.PORT || 8080;
app.listen(port,function() {
  console.log('Now is running on port' + port);
});
