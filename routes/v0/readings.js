var Reading = require('../../models/v0/reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var mongooseCallbacks = require('../../lib/mongoose-callbacks')
var objectSerializer = require('../../lib/object-serializer')

router.route('/readings')

.get(function(req,res) {
  Reading.find(function(err,readings) {
    var serialized = objectSerializer.serializeObjectIntoJSONAPI(readings)
    res.json(serialized)
  })
})

.post(function(req,res) {
  var reading = new Reading(req.body)
  reading.save(mongooseCallbacks.callbackWithMessage(res,req,"reading successufully added"))
})

router.route('/readings/:id')

.put(function(req,res) {

  var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',req.body)

  Reading.update(
    {_id: req.params.id},
    updateObj,
    function(err,reading) {
      errorHelper.errorHandler(err,req,res)
      return res.json({message: 'reading successufully updated'})
    })
  })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,reading) {
      errorHelper.errorHandler(err,req,res)
      var serialized = objectSerializer.serializeObjectIntoJSONAPI(reading)
      res.json(serialized)
    })
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    },
    mongooseCallbacks.callbackWithMessage(res,req,"reading successufully deleted")
  )
})

module.exports = router
