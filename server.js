//server.js

//BASE SETUP
// =============================================================================================================================

//call the needed packages


var express    = require('express')
var cors = require('cors')
var app        = express()
process.env.NODE_ENV = app.get('env') //set node env

var environment = require('./config/environment')  // get our config file
var db = require('./config/db')
var routesSetup = require('./config/routes')
var jwtHelper = require('./lib/jwthelper')

app.use(cors());

db.setupDatabase()

app.set('superSecret', environment.secret)  // secret variable

//Block secret urls midlleware
app.use(function(req, res, next){

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  var isUserPostRoute = ((req.path.indexOf('users') > -1 && req.method === 'POST') || req.path.indexOf('auth') > -1)

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

    if(err) {
        res.send(err.message)
    }
    next()
})

module.exports = app

//Service setup
var port = process.env.PORT || 8080
app.listen(port,function() {
  console.log('Now is running on port' + port)
})
