var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    authToken: {
      type: String,
      required: [true, 'required authToken is missing']
    },
    name: {
      type: String,
      required: [true, 'required name is missing']
    },
    email: {
      type: String,
      required: [true, 'required email is missing']
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now
    },
    readings: [
      {
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
          type: Number,
          ref: 'Reading',
          required: [true, 'required readingId is missing']
        },
        emojis: [String]
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
