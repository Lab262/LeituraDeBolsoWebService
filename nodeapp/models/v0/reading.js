var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

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
    readOfTheWeek: {
      type: Boolean,
      required: false,
      default: false
    },
    timeToReadInSeconds: {
      type: Number,
      required: true,
      default: 60
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
});

module.exports = mongoose.model('Reading', ReadingSchema);
