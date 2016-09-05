const mongoose   = require('mongoose');
const environment = require('./environment'); // get our config file
const options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

// var mongodbUri = 'mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso';
mongoose.connect(environment.database, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongolab database connected');
});

exports.db = db;
