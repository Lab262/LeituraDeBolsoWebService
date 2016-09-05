//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages
var express    = require('express');
var app        = express();
var config = require('./config'); // get our config file

//Configure app to user bodyParse()
//this will let use get the data from a post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//MOGOOSE
var mongoose   = require('mongoose');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
// var mongodbUri = 'mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso';
mongoose.connect(config.database, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('Mongolab database connected');
});
app.set('superSecret', config.secret); // secret variable


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
