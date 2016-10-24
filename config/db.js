
function setupDatabase(){  var mongoose   = require('mongoose')
  var environment = require('./environment')  // get our config file
  var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } }

// var mongodbUri = 'mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso'
  mongoose.connect(environment.database.host, options)
  var db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    mongoose.Promise = global.Promise;
  console.log('Mongolab database connected in ' + environment.database.host)
  })
}

exports.setupDatabase = setupDatabase

// exports.db = db
