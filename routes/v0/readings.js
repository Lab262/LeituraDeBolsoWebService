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

  Reading.find(req.query).skip(skip).limit(limit).sort({ readOfTheDay: 'descending'}).exec(function(err,readings) {
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

    // return res.json({"foi": "deu"})
    objectSerializer.deserializeJSONAPIDataIntoObject(req.body).then(function(deserialized) {

      var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',deserialized)
      return Reading.findOneAndUpdate({_id: req.params.id},updateObj,{"new": true}).exec()

    }).then(function(reading) {

      if (reading.n < 1) {
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("id não corresponde a uma reading")
        return res.status(403).json(error)
      } else {
        //
        return res.json(objectSerializer.serializeObjectIntoJSONAPI(reading))

      }

    }).then(function(err) {

      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI(JSON.stringify(err))
      return res.status(403).json(error)
    })

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
