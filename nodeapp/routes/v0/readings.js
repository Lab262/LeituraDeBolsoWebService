var Reading = require('../../models/v0/reading');
var express = require('express');
var router = express.Router();

router.route('/readings')

  .get(function(req,res) {
    Reading.find(function(err,readings) {
      res.json(readings);
    });
  })

  .post(function(req,res) {
    var reading = new Reading(req.body);
    reading.save(function(err) {
      res.send({message: 'reading successufully added'});
    });
  })

router.route('/readings/:id')

  .put(function(req,res) {
    var updateObj = {$set: {}};
    for(var param in req.body) {
      updateObj.$set[param] = req.body[param];
    }
    Reading.update(
      {_id: req.params.id},
      updateObj,
      function(err,user) {
        return res.json({message: 'reading successufully updated'})
      })
    })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,reading) {
      res.json(reading);
    });
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    }, function(err,reading) {
      res.json({message: 'reading successufully deleted'});
    });
  })

module.exports = router;
