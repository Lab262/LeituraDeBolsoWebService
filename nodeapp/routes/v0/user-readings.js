var User = require('../../models/v0/user');
var Reading = require('../../models/v0/reading');
var express = require('express');
var router = express.Router();

router.route('/users/:userId/readings')

  .get(function(req,res) {
    var callback =  function(err,user) {
      if (user == null) {
        return res.status(404).send({message: "user not found"});
      }
        res.json(user);
    }
    User.findOne({ _id: req.params.userId}).select('readings').exec(callback);
  })

  .post(function(req,res) {
    if (req.body._readingId == null) {
      return res.status(422).send({message: "_readingId is missing"});
    }
    Reading.count({_id: req.body._readingId}, function (err, count){
      if(count <= 0){
        return res.status(403).send({message: "_readingId not corresponds to any reading"});
      }
        User.findOne({ _id: req.params.userId },function(err,user) {
          if(!user)
            errorHelper.entityNotFoundError(req,res)

          var userReading = user.readings.filter(function (reading) { return reading._readingId == req.body._readingId})
          if (userReading.length > 0) {
            return res.status(403).send({message: "_readingId is already in use for this user"})
          }
          User.update( {id: req.params.userID},{
            $addToSet: {
              readings:{
                $each: [req.body]}
              }},
              {upsert:true},
              function(err){
                          return res.send({message: "user-reading successfully added"});
          });
        });
      })
  })

  .delete(function(req,res) {
    User.update(
      {_id: req.params.userId},
      { $set:
        {'readings':
          []
         }
       }, function(err){
      return res.json({message: 'user-readings successufully deleted'})
    })
  })

router.route('/users/:userId/readings/:readingId')
  .get(function(req,res) {
    User.findOne({ _id: req.params.userId},function(err,user) {
      if(!user)
        errorHelper.entityNotFoundError(req,res)
        
      var reading = user.readings.filter(function (reading) { return reading._readingId == req.params.readingId})
      return res.json(reading)
    })
  })

  .put(function(req,res) {
    var updateObj = {$set: {}};
    for(var param in req.body) {
      updateObj.$set['readings.$.'+param] = req.body[param];
    }
    User.update(
      { _id: req.params.userId,
        'readings._readingId': req.params.readingId},
        updateObj,
        function(err,user) {
          return res.json({message: 'user-reading successufully updated'})
    })
  })

  .delete(function(req,res) {
    User.update(
      {_id: req.params.userId},
      { $pull:
        {'readings':
           {_readingId: req.params.readingId}
         }
       },
       function(err){
         return res.json({message: 'user-reading successufully deleted'})
    })
  })


module.exports = router;
