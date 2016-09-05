var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    password: {
      type: String,
      required: [true, 'required password is missing']
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
        _readingId: {
          type: String,
          ref: 'Reading',
          required: [true, 'required readingId is missing']
        },
        emojis: [String]
    }
  ]
});


UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
