var jwt = require('jsonwebtoken')
var bcrypt       = require('bcrypt')


exports.verifyJsonWebToken = function(req,res, next,app) {
  console.log("===========================================================================================")

   var token = req.headers['x-access-token']
   // decode token
   if (token) {
     // verifies secret and checks exp
     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
       if (err) {
         return res.status(401).json({message: 'Failed to authenticate token.'})
       } else {
      //    // if everything is good, save to request for use in other routes
         req.decoded = decoded
       }
     })

   } else {
     // if there is no token
     // return an error
     return res.status(401).send({message: 'Missing json web token.'})
   }
}

exports.comparePassword = function(candidatePassword,passwordToCompare,  cb) {
    bcrypt.compare(candidatePassword, passwordToCompare, function(err, isMatch) {
        if (err) { return cb(err) }
        cb(null, isMatch)
    })
}
