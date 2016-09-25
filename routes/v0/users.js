var User = require('../../models/v0/user')
var express = require('express')
var router = express.Router()
var Environment = require('../../config/environment')
var Jwt = require('jsonwebtoken')
var Mailer = require('../../lib/mailer')
var errorHelper= require('../../lib/error-handler')
var mongooseCallbacks = require('../../lib/mongoose-callbacks')
var objectSerializer = require('../../lib/object-serializer')

router.route('/users')

.get(function(req,res) {
  User.find(function(err,users) {
    var serialized = objectSerializer.serializeObjectIntoJSONAPI(users)
    res.json(serialized)
  })
})

.post(function(req,res) {

  User.findOne({email: req.body.email}, function(err, user) {

          if (user !== null) {
            if (user.isEmailVerified) {
              return res.status(403).send({message: "This email is already in use"})
            } else {
              User.remove({email: req.body.email}, function (err) {
                errorHelper.errorHandler(err,req,res)
              })
            }
          }
          var newUser = new User(req.body)
          newUser.save(function(err) {
            errorHelper.errorHandler(err,req,res)
            var tokenData = {
              email: newUser.email,
              id: newUser._id
            }

         var token = Jwt.sign(tokenData,Environment.secret)

         Mailer.sentMailVerificationLink(newUser,token)

         var serialized = objectSerializer.serializeObjectIntoJSONAPI(newUser)

         res.send({message: 'Please confirm your email id by clicking on link in your email:' + newUser.email , user: serialized, token: token})
     })
  })
})

router.route('/users/:id')

.put(function(req,res) {
  // var updateObj = {$set: {}}

  User.findOne(
    {_id: req.params.id},
    function(err,user) {
      if(!user){
        errorHelper.entityNotFoundError(req,res)
      }

      var user =  objectSerializer.deserializerJSONIntoObject(user,req.body)

      user.save(function(err,user) {

        res.json({message: 'user successufully updated'})
      })
    })
  })

  .get(function(req,res) {
    User.findOne({ _id: req.params.id},function(err,user) {
      errorHelper.errorHandler(err,req,res)
      var serialized = objectSerializer.serializeObjectIntoJSONAPI(user)

      res.json(serialized)
    })
  })

  .delete(function(req,res) {
    User.remove({
      _id: req.params.id
    },
    mongooseCallbacks.callbackWithMessage(res,req,"user successufully deleted")
    )
  })

module.exports = router
