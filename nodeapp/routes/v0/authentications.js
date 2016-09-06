var User = require('../../models/v0/user');
var express = require('express');
var router = express.Router();
const Environment = require('../../config/environment');
const Jwt = require('jsonwebtoken');
const Mailer = require('../../lib/mailer')
const PasswordGenerator = require('password-generator');

router.route('/login')

  .post(function(req, res){

    User.findOne({
      email: req.body.email
    }, function(err,user) {

      if(!user){
        return res.status(401).send({message: "Authentication failed. User not found"})
      }

      if(!user.isEmailVerified) {
        return res.status(403).send({message: "Your email address is not verified. please verify your email address to proceed"})
      }


      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          return res.status(401).send({message: "Authentication failed. Wrogn password"})
        } if (isMatch) {
               var result = {
                   token: Jwt.sign(user,Environment.secret),
               }
               return res.json(result);
        }
      })
    })
  });

router.route('/verifyEmail/:token')
  .get(function(req,res){

    Jwt.verify(req.params.token, Environment.secret, function(err, decoded) {
      if(decoded === undefined){
        return res.status(403).send({message: "invalid verification link"});
      }

      User.findOne({ _id: decoded.id, email: decoded.email}, function(err, user){
          if (user === null){
            return res.status(403).send({message: "invalid verification link"});
          }
          if (user.isEmailVerified === true){
            return res.status(403).send({message: "Account is already verified"});
          }
          user.isEmailVerified = true;

          user.save(function(err) {
              return res.json({message:"account sucessfully verified"});
          });

      })
    })


  })

router.route('/resendVerificationEmailLink')
    .post(function(req,res){

      User.findOne({ email: req.body.email}, function(err, user) {
        if (!err) {
            if (user === null) {
            	return res.status(403).send({message: "Invalid email or password"});
            }

            user.comparePassword(req.body.password, function(err, isMatch) {
              if (err) {
                return res.status(401).send({message: "Authentication failed. Wrong password"})
              }

              if (user.isEmailVerified) {
                return res.status(403).send({message: "Your email address is already verified"})
              }else{

                var tokenData = {
                  email: user.email,
                  id: user._id
                }

                var token = Jwt.sign(tokenData,Environment.secret)
                Mailer.sentMailVerificationLink(user,token);
                return res.json({message:"account verification link is sucessfully send to your email id: " + user.email});
              }
            });
        }
    });
  })

router.route('/forgotPassword')
  .post(function(req,res) {
    var random = PasswordGenerator(12, false);

    User.findOne({ email: req.body.email }, function(err, user){
      if (!err) {
          if (user === null){
              return res.status(403).send({message:"This email has not been registered"});
          }
          if (user.isEmailVerified == false ) {

            var tokenData = {
              email: user.email,
              id: user._id
            }
            var token = Jwt.sign(tokenData,Environment.secret)
            Mailer.sentMailVerificationLink(user,token);

            return res.status(403).send({message:"Your email address is not verified. please verify your email address to proceed"})
          } else {
            user.password = random;
            user.save(function(err,user) {
              Mailer.sentMailForgotPassword(user, random)
              return res.json({message: "password is send to your registered email id: " + req.body.email});
            })
          }
      }
    });

  })

module.exports = router;
