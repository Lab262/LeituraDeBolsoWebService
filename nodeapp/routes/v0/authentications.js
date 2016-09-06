var User = require('../../models/v0/user');
var express = require('express');
var router = express.Router();
const Environment = require('../../config/environment');
const Jwt = require('jsonwebtoken');

router.route('/authenticate')

  .post(function(req, res){

    User.findOne({
      email: req.body.email
    }, function(err,user) {
      if(!user){
        return res.status(404).send({message: "Authentication failed. User not found"})
      }

      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          return res.status(401).send({message: "Authentication failed. Wrogn password"})
        }

        if (isMatch) {
               var result = {
                   email: user.email,
                   token: Jwt.sign(user,Environment.secret),
               }
               return res.json(result);
        }
      })
    })
  });

module.exports = router;
