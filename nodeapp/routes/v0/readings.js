var Reading = require('../../models/v0/reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')

router.route('/readings')

  .get(function(req,res) {
    Reading.find(function(err,readings) {
      res.json(readings)
    })
  })

  .post(function(req,res) {
    var reading = new Reading(req.body)
    reading.save(function(err) {
      errorHelper.errorHandler(err,req,res)
      res.send({message: 'reading successufully added'})
    })
  })

router.route('/readings/:id')

  .put(function(req,res) {
    var updateObj = {$set: {}}
    for(var param in req.body) {
      if (req.body.hasOwnProperty(param)) {
        updateObj.$set[param] = req.body[param]
      }
    }
    Reading.update(
      {_id: req.params.id},
      updateObj,
      function(err,reading) {
        errorHelper.errorHandler(err,req,res)
        return res.json({message: 'reading successufully updated',reading:reading})
      })
    })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,reading) {
      errorHelper.errorHandler(err,req,res)
      res.json(reading)
    })
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    }, function(err) {
      errorHelper.errorHandler(err,req,res)
      res.json({message: 'reading successufully deleted'})
    })
  })

module.exports = router
