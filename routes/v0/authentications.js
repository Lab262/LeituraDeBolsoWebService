var User = require('../../models/v0/user')
var express = require('express')
var router = express.Router()
var Environment = require('../../config/environment')
var Jwt = require('jsonwebtoken')
var JwtHelper = require('../../lib/jwthelper')
var Mailer = require('../../lib/mailer')
var PasswordGenerator = require('password-generator')
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')

router.route('/auth/login')
.post(function(req, res){


  verifyUserAndConfirmMailVerification(req,res,function(user) {
    authenticateUser(req,res,user)
  })

})

router.route('/auth/adminLogin')
.post(function(req, res){

  verifyUserAndConfirmMailVerification(req,res,function(user) {
      if (user.isAdmin) {
        authenticateUser(req,res,user)
      } else {
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Esse login não e de um usuário administrador", "email")
        return res.status(422).json(error)

      }
  })

})

router.route('/auth/verifyEmail/:token')
.get(function(req,res){

  Jwt.verify(req.params.token, Environment.secret, function(err, decoded) {
    if(decoded === undefined){
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Link de verificação inválida.", "email")
      return res.status(403).json(error)
        }

    User.findOne({ _id: decoded.id, email: decoded.email}, function(err, user){
      if (user === null){
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Link de verificação inválida.", "email")
        return res.status(403).json(error)

      }
      if (user.isEmailVerified === true){
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Email já verificado", "email")
        return res.status(403).json(error)

      }
      user.isEmailVerified = true


      user.save(function(err) {
        if (err) {
          errorHelper.erorHandler(err,req,res)
        } else {
          return res.status(200).json({message: 'Email verified successufully'})
        }
      })

    })
  })
})

router.route('/auth/resendVerificationEmailLink')
.post(function(req,res){

  User.findOne({ email: req.body.email }, function(err,user) {
    errorHelper.errorHandler(err,req,res)

    if(!user){
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Email não registrado", "email")
      return res.status(422).json(error)
    }

    var token = Jwt.sign(user.tokenData,Environment.secret)
    Mailer.sentMailVerificationLink(user,token)

    return res.json({message:"Link de verificação de conta foi enviado para o seu email: " + user.email})
  });

})

router.route('/auth/forgotPassword')
.post(function(req,res) {
  var random = PasswordGenerator(12, false)

  User.findOne({ email: req.body.email }, function(err, user){
    if (!err) {
      if (user === null){
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Email não registrado", "email")
        return res.status(422).json(error)
      }
      if (user.isEmailVerified === false ) {

        var token = Jwt.sign(user.tokenData,Environment.secret)
        Mailer.sentMailVerificationLink(user,token)
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Seu email ainda não foi confirmado, por favor verifique seu email para continuar", "email")
        return res.status(403).json(error)
      } else {
        user.password = random
        user.save(function(err,user) {
          Mailer.sentMailForgotPassword(user, random)
          return res.json({message: "A senha foi enviada para o email cadastrado: " + req.body.email})
        })
      }
    }
  })

})

router.route('/auth/facebook')
.post(function(req,res) {
  if (req.body.facebook === null || req.body.facebook.password === null || req.body.facebook.password.indexOf(Environment.facebook.passwordSecret) < 0) {
    var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Invalid facebook password format", "facebook.password")
    return res.status(403).json(error)

  }

  User.findOne({ email : req.body.email }, function(err,user) {
    //CREATE USER AND LOGIN

    if (user === null) {
      //return res.json("USUARIO NAO EXISTE")

      var newUser = new User(req.body)
      newUser.isEmailVerified = true
      newUser.password = req.body.facebook.password
      newUser.save(function(err) {
        errorHelper.errorHandler(err,req,res)

        var token = Jwt.sign(newUser.tokenData,Environment.secret)

        return res.json({message: 'successufully create account throught facebook with email:' + newUser.email , user: newUser, token: token})
      })
    }else if (user.facebook === null || user.facebook.id === null) {
      user.facebook.id = req.body.facebook.id
      user.facebook.password = req.body.facebook.password
      user.save(function(err) {
        errorHelper.errorHandler(err,req,res)
        var token = Jwt.sign(user.tokenData,Environment.secret)

        return res.json({message: 'successufully associate account throught facebook with email:' + user.email , user: newUser, token: token})
      })
    } else {

      JwtHelper.comparePassword(req.body.facebook.password, user.password, function(err, isMatch) {
        if (err) {
          var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Falha na autenticação: Password Incorreto", "password")
          return res.status(422).json(error)
        }
        if (isMatch) {
          var token = Jwt.sign(user.tokenData,Environment.secret)
          return res.json({message: 'successufully logged throught facebook with email:' + user.email , user: user, token: token})
        } else {
          var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Falha na autenticação: Password Incorreto", "password")
          return res.status(422).json(error)
        }
      })
    }

  })
})

function verifyUserAndConfirmMailVerification(req,res,callbackAfterVerification){

  User.findOne({ email: req.body.email }, function(err,user) {
    errorHelper.errorHandler(err,req,res)

    if(!user){
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Falha na autenticação. Usuário não encontrado.", "email")
      return res.status(422).json(error)
    }

    if(!user.isEmailVerified) {
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Seu email ainda não foi verificado, por favor verifique seu email para continuar", "email")
      return res.status(403).json(error)
    } else {
      callbackAfterVerification(user)
    }
  })

}

function authenticateUser(req,res,user) {

  JwtHelper.comparePassword(req.body.password, user.password, function(err, isMatch) {
    if (err) {
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Falha na autenticação: Password Incorreto", "password")
      return res.status(422).json(error)
    } if (isMatch) {

      var result = {
        token: Jwt.sign(user.tokenData,Environment.secret),
        user: user
      }

      return res.json(result)
    } else {
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Falha na autenticação: Password Incorreto", "password")
      return res.status(422).json(error)
    }
  })
}

module.exports = router
