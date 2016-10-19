var mongoose     = require('mongoose')
var Schema       = mongoose.Schema

var UserReadingSchema = new Schema({

  alreadyRead: {
    type: Boolean,
    required: false,
    default: false
  },
  isFavorite: {
    type: Boolean,
    required: false,
    default: false
  },
  isShared: {
    type: Boolean,
    required: false,
    default: false
  },
  readingId: {
    type: String,
    ref: 'Reading',
    required: [true, 'required readingId is missing']
  },
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'required userId is missing']

  }
})

module.exports = mongoose.model('UserReading', UserReadingSchema)
