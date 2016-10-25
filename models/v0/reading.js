var mongoose     = require('mongoose')
var Schema       = mongoose.Schema
var UserReading = require('./user-reading')

var ReadingSchema   = new Schema({
    authorName: {
      type: String,
      required: [true, 'required authorName is missing']
    },
    content: {
      type: String,
      required: [true, 'required content is missing']
    },
    title: {
      type: String,
      required: [true, 'required title is missing']
    },
    readOfTheDay: {
      type: Boolean,
      required: false,
      default: false
    },
    timeToReadInMinutes: {
      type: Number,
      required: [true, 'required time to read is missing']
    },
    publishDate: {
      type: Date,
      required: false,
      default: Date.now
    },
    createdAt : {
      type: Date,
      required: false,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now
    },
    emojis: [String]
})

ReadingSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    console.log(this._id)

    console.log({'readingId': this._id})
    // UserReading.remove({readingId: JSON.stringify(this._id)}).exec();
    // Submission.remove({client_id: this._id}).exec();
    UserReading.remove({'readingId': this._id}, function(err, userReading) {
      console.log(userReading)
      console.log(err)
      // fulfill();
      return next();
    });
      // return new Promise(function (fulfill, reject){
      //
      // })
});

module.exports = mongoose.model('Reading', ReadingSchema)
