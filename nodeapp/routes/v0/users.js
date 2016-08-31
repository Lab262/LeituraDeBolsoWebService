var User = require('../../models/v0/user');
var express = require('express');
var router = express.Router();


router.route('/users')

  .get(function(req,res) {
    User.find(function(err,users) {
      res.json(users);
    });
  })

  .post(function(req,res) {
    var user = new User(req.body);
    user.save(function(err) {
      res.send({message: 'user successfully added'});
    });
  })

router.route('/users/:id')

  .put(function(req,res) {
    var updateObj = {$set: {}};
    for(var param in req.body) {
      updateObj.$set[param] = req.body[param];
    }
    User.update(
      {_id: req.params.id},
      updateObj,
      function(err,user) {
        return res.json({message: 'user successufully updated'})
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
