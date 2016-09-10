//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages
var express    = require('express') 
var app        = express() 
var environment = require('./config/environment')  // get our config file
var db = require('./config/db') 
var routesSetup = require('./config/routes') 
var jwtHelper = require('./lib/jwthelper') 
var errorHelper = require('./lib/error-handler')

app.set('superSecret', environment.secret)  // secret variable
app.use(errorHelper.errorHandler)

//Block secret urls midlleware
app.use(function(req, res, next){

  var isUserPostRoute = ((req.path.indexOf('users') > -1 && req.method == 'POST')
  || req.path.indexOf('auth') > -1)

  if (!isUserPostRoute) {
    jwtHelper.verifyJsonWebToken(req,res,next,app) 
  }
  next() 
}) 

//Configure app to user bodyParse()
//this will let use get the data from a post
var bodyParser = require('body-parser') 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 


var morgan      = require('morgan') 
app.use(morgan('dev')) 

routesSetup.setupRoutesAndVersions(app) 

app.use(function (err, req, res, next) {
  console.log('passou no error loger')
    if(err) {
        res.status(500).send(err.message)  //Never called
    }
    next() 
}) 

module.exports = app 

//Service setup
var port = process.env.PORT || 8080 
app.listen(port,function() {
  console.log('Now is running on port' + port) 
}) 
