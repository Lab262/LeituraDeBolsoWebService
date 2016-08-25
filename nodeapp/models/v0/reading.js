var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReadingSchema   = new Schema({
    authorName:           String,
    content:              String,
    title:                String,
    readOfTheWeek:        Boolean,
    timeToReadInSeconds:  Number,
    publishDate:          Date,
    createdAt :           Date,
    updatedAt:            Date
});

module.exports = mongoose.model('Reading', ReadingSchema);
