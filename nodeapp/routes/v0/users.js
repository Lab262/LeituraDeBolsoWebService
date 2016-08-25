var User = require('../../models/v0/User');
var express = require('express');
var router = express.Router();


router.route('/Users')

  .get(function(req,res) {

    User.find(function(err,Users) {
      if (err) {
        return res.send(err);
      }

      res.json(Users);

    });
  })

  .post(function(req,res) {
    var User = new User(req.body);

    User.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.send({message: 'User added'});
    });

  })

module.exports = router;
