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

  var callBack = function(deserialized) {
    console.log(deserialized)
    var reading = new Reading(deserialized)
    reading.save(mongooseCallbacks.callbackWithMessage(res,req,"reading successufully added"))
  }

  objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)

})

router.route('/readings/:id')

.put(function(req,res) {

  var callBack = function(deserialized) {
    console.log(deserialized)

    var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',deserialized)

    console.log(updateObj)
    Reading.update(
      {_id: req.params.id},
      updateObj,
      function(err,reading) {
        errorHelper.errorHandler(err,req,res)
        return res.json({message: 'reading successufully updated'})
      })

  }

  objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)


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
