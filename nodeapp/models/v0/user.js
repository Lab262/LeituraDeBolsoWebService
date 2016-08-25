var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    authToken: String,
    name:      String,
    email:     String,
    createdAt: Date,
    updatedAt: Date
    readings: [
      {
        alreadyRead: Boolean,
        isFavorite: Boolean,
        isShared: Boolean,
        readingId: { type: Number, ref: 'Reading' },
        emojis: [String]
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
