//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages
const express    = require('express');
const app        = express();
const environment = require('./config/environment'); // get our config file
const db = require('./config/db');
const routesSetup = require('./config/routes');
const jwtHelper = require('./lib/jwthelper');

app.set('superSecret', environment.secret); // secret variable

app.use(function(req, res, next){

  const isUserPostRoute = ((req.path.indexOf('users') > -1 && req.method == 'POST') || req.path.indexOf('login') > -1 ||  req.path.indexOf('verifyEmail') > -1) 
  if (!isUserPostRoute) {
    jwtHelper.verifyJsonWebToken(req,res,next,app);
  }
  next();
});

//Configure app to user bodyParse()
//this will let use get the data from a post
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var morgan      = require('morgan');
app.use(morgan('dev'));

routesSetup.setupRoutesAndVersions(app);

app.use(function (err, req, res, next) {
  console.log('passou no error loger')
    if(err) {
        res.status(500).send(err.message); //Never called
    }
    next();
});

module.exports = app;

//Service setup
var port = process.env.PORT || 8080;
app.listen(port,function() {
  console.log('Now is running on port' + port);
});
