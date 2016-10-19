var mongoose     = require('mongoose')
var Schema       = mongoose.Schema
var bcrypt       = require('bcrypt')
var SALT_WORK_FACTOR = 10

var UserSchema = new Schema({
    password: {
      type: String,
      required: [true, 'required password is missing']
    },
    name: {
      type: String,
      required: [false, 'required name is missing']
    },
    email: {
      type: String,
      required: [true, 'required email is missing']
    },
    isEmailVerified: {
      type: Boolean,
      required: false,
      default: false
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false
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
    facebook: {
      id: String,
      token: String,
      password: String
    }
})


UserSchema.pre('save', function(next) {
    var user = this
    console.log("PASSOU NO SAVE")

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password') && !user.isModified('facebook.password') ) { return next() }
    // generate a salt
    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) { return next(err) }
          // hash the password along with our new salt
          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) { return next(err) }
              // override the cleartext password with the hashed one
              user.password = hash
              next()
          })
      })
    } else if (user.isModified('facebook.password')) {
      console.log(user)
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) { return next(err) }
          // hash the password along with our new salt
          bcrypt.hash(user.facebook.password, salt, function(err, hash) {
              if (err) { return next(err) }
              // override the cleartext password with the hashed one
              user.facebook.password = hash
              next()
          })
      })
    } else {
      return next()
    }

})

UserSchema.virtual('tokenData').get(function () {
  var tokenData = {
    email: this.email,
    id: this._id
  }
  return tokenData
});

module.exports = mongoose.model('User', UserSchema)
