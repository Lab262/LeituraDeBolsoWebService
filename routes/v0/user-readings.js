var User = require('../../models/v0/user')
var Reading = require('../../models/v0/reading')
var UserReading = require('../../models/v0/user-reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')


router.route('/users/:userId/readingsOfTheWeek')

  .get(function(req,res) {

  //   Reading.find({}).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).sort({ readOfTheDay: 'descending'}).exec().then( function(docs) {
  //
  //       console.log(docs);
  //       return res.json(docs)
  // }).then(function(err){
  //   return res.json(err);
  // });

    UserReading.find({ userId: req.params.userId}).exec().then(
    function(userReadings) {

      var readingsArray = userReadings.map(function(currentValue,index,arr) {
          return currentValue.readingId
      })

      var query = {
        "_id": { "$nin": readingsArray }
      }

      return Reading.find(query).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).sort({ readOfTheDay: 'descending'}).exec()

    }).then(function(reading){

        var serialized = objectSerializer.serializeObjectIntoJSONAPI(reading)
        return  res.json(serialized)
    })
    .then(function(err) {
        return  res.json(err)
    })

  })

router.route('/users/:userId/readings')

  .get(function(req,res) {

    UserReading.find({ userId: req.params.userId}).exec().then(
      function(userReading) {
        var serialized = objectSerializer.serializeObjectIntoJSONAPI(userReading)
          return res.json(serialized)
      },
      function(err) {
    })

  })

  .post(function(req,res) {

    var objectDeserialized = {}
    req.body.data.attributes.userId = req.params.userId

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body).
    then(function(deserialized) {

      objectDeserialized = deserialized
    if (deserialized.readingId === null) {
       var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("readingId is missing")
       return res.status(422).json(error)
     }
     if (deserialized.userId === null) {
       var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("userId is missing")
       return res.status(422).json(error)
     }
      return Reading.count({_id: deserialized.readingId}).exec()

    })
   .then(function(countReadings){

      if(countReadings <= 0){

        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("readingId not corresponds to any reading")
        return res.status(403).json(error)
      }
     return User.count({_id: objectDeserialized.userId}).exec()

   }).then(function(countUsers){

         if(countUsers <= 0){

           var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("userId not corresponds to any user")
           return res.status(403).json(error)
         }
         return UserReading.count({'userId': objectDeserialized.userId, 'readingId': objectDeserialized.readingId}).exec()
       })
    .then(function(countUserReadings){

         if(countUserReadings > 0) {
           var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("readingId is already in use for this user")
           return res.status(403).json(error)
         } else {

           var userReading = new UserReading(objectDeserialized)

            return userReading.save()
         }
       })
       .then(function(userReading){

          return res.status(201).json(objectSerializer.serializeObjectIntoJSONAPI(userReading))
       })
       .then(function(err) {

         var error = objectSerializer.serializeSimpleErrorIntoJSONAPI(JSON.stringify(err))
         return res.status(403).json(error)
       })

   })


  .delete(function(req,res) {

    UserReading.remove({
      userId: req.params.userId
    },
    function(err) {
      if (err) {
        errorHelper.erorHandler(err,req,res)
      } else {
        return res.status(204).json({message: "all readings successufully deleted"})
      }
    })

  })

router.route('/users/:userId/readings/:readingId')
  .get(function(req,res) {

    UserReading.findOne({ readingId: req.params.readingId},function(err,userReading) {
      errorHelper.errorHandler(err,req,res)
      var serialized = objectSerializer.serializeObjectIntoJSONAPI(userReading)
      return res.json(serialized)
    })

  })

  .patch(function(req,res) {

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body).then(function(deserialized) {

      var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',deserialized)
      return UserReading.update({readingId: req.params.readingId},updateObj).exec()


    }).then(function(userReading) {

      return res.json({message: 'user reading successufully updated'})

    }).then(function(err) {

      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI(JSON.stringify(err))
      return res.status(403).json(error)
    })

  })

  .delete(function(req,res) {
    UserReading.remove({
      readingId: req.params.readingId
    },
    function(err) {
      if (err) {
        errorHelper.erorHandler(err,req,res)
      } else {
        return res.status(204).json({message: "all readings successufully deleted"})
      }
    })
  })


module.exports = router
