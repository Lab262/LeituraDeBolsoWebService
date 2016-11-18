var Reading = require('../../models/v0/reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')

router.route('/readings')

.get(function(req,res) {

  var pageVariables = objectSerializer.deserializeQueryPaginationIntoVariables(req)
  var totalLength = 0

  Reading.count(req.query).exec().then(function(count){

   totalLength = count
   if (totalLength > 0) {

     return Reading.find(req.query).skip(pageVariables.skip).limit(pageVariables.limit).sort({ readOfTheDay: 'descending'}).exec()
   } else {

     return res.status(200).json({data: []});
   }

 }).then(function(readings) {

    var serialized = objectSerializer.serializeObjectIntoJSONAPI(readings,totalLength, pageVariables.limit)
    return res.json(serialized)
  }).catch(function(err){

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

    }).catch(function(err) {

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
    Reading.findOne({_id: req.params.id}).exec().then(function(reading){

      if (reading === null ){
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("Reading not found")
        return res.status(403).json(error)
      }
      return reading.remove()
    }).then(function(reading) {
      return res.status(204).json({message: "reading successufully deleted"})
    
    }).catch(function(err){
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI(JSON.stringify(err))
      return res.status(403).json(error)

    })

})

module.exports = router
