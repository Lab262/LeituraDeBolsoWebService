var Reading = require('../../models/v0/reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')

router.route('/readings')

.get(function(req,res) {

  var skip = parseInt(req.query.skip)
  var limit = parseInt(req.query.limit)

  delete req.query.skip
  delete req.query.limit

  Reading.find(req.query).skip(skip).limit(limit).exec(function(err,readings) {
    var serialized = objectSerializer.serializeObjectIntoJSONAPI(readings)
    return res.json(serialized)
  })

})

.post(function(req,res) {

  var callBack = function(deserialized) {
    var reading = new Reading(deserialized)
    reading.save( function(err, reading, numAffected) {
      return res.status(201).json(objectSerializer.serializeObjectIntoJSONAPI(reading))
    })
  }

  objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)

})

router.route('/readings/:id')

.patch(function(req,res) {

  var callBack = function(deserialized) {

    var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',deserialized)

    Reading.update(
      {_id: req.params.id},
      updateObj,
      function(err,reading) {
        errorHelper.errorHandler(err,req,res)
          // var serialized = objectSerializer.serializeObjectIntoJSONAPI(reading)
          console.log(reading)
        return res.json(reading);
      })

  }

  objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)


  })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,reading) {
      errorHelper.errorHandler(err,req,res)
      var serialized = objectSerializer.serializeObjectIntoJSONAPI(reading)
      return res.json(serialized)
    })
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    },
    function(err) {
      if (err) {
        errorHelper.erorHandler(err,req,res)
      } else {
        return res.status(204).json({message: "reading successufully deleted"})
      }
    })
})

module.exports = router
