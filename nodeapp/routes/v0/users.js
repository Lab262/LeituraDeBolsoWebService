var User = require('../../models/v0/user');
var express = require('express');
var router = express.Router();
const Environment = require('../../config/environment');
const Jwt = require('jsonwebtoken');
const Mailer = require('../../lib/mailer')

router.route('/users')

.get(function(req,res) {
  User.find(function(err,users) {
    res.json(users);
  });
})

.post(function(req,res) {

  User.findOne({email: req.body.email}, function(err, user) {

          if (user != null) {
            if (user.isEmailVerified) {
              return res.status(403).send({message: "This email is already in use"})
            } else {
              User.remove({email: req.body.email}, function (err) {
              });
            }
          }
          var newUser = new User(req.body);
          newUser.save(function(err) {

            var tokenData = {
              email: newUser.email,
              id: newUser._id
            }

         var token = Jwt.sign(tokenData,Environment.secret)

         Mailer.sentMailVerificationLink(newUser,token);
         res.send({message: 'Please confirm your email id by clicking on link in your email:' + newUser.email , user: newUser, token: token});
     });
  });
})

router.route('/users/:id')

.put(function(req,res) {
  var updateObj = {$set: {}};

  User.findOne(
    {_id: req.params.id},
    function(err,user) {
      for(var param in req.body) {
        user[param] = req.body[param];
      }
      user.save(function(err,user) {
        res.json({user: user,message: 'user successufully updated'})
      })
    })
  })

  .get(function(req,res) {
    User.findOne({ _id: req.params.id},function(err,user) {
      res.json(user);
    });
  })

  .delete(function(req,res) {
    User.remove({
      _id: req.params.id
    }, function(err,user) {
      res.json({message: 'user successufully deleted'});
    });
  })

module.exports = router;
