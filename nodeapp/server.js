//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages
var express    = require('express');
var app        = express();
//Configure app to user bodyParse()
//this will let use get the data from a post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//MOGOOSE
var mongoose   = require('mongoose');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
var mongodbUri = 'mongodb://thiago:waldemir@ds139985.mlab.com:39985/testmongo';
mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('Mongolab database connected');
});


//Router setup
var ROUTES = {'Readings':'/readings','Users':'/users'};
var VERSIONS = {'Pre-Production': '/v0'};
for (var versionIndex in VERSIONS) {
  for (var currentRouteIndex in ROUTES) {
    app.use('/api' + VERSIONS[versionIndex], require('./routes' + VERSIONS[versionIndex] + ROUTES[currentRouteIndex]));
  }
}

module.exports = app;


//Service setup
var port = process.env.PORT || 8080;
app.listen(port,function() {
  console.log('Now is running on port' + port);
});