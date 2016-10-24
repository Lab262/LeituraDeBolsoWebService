var User = require('../../models/v0/user')
var Reading = require('../../models/v0/reading')
var UserReading = require('../../models/v0/user-reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')


router.route('/users/:userId/readingsOfTheDay')

  .get(function(req,res) {

    UserReading.find({ userId: req.params.userId}).sort("-createdAt").exec().then(
      function(userReadings) {
        var userReadingsSorted = userReadings;

        if (userReadings.length > 0) {

          userReadingsSorted = userReadings.sort(function(a, b){return b.createdAt-a.createdAt})

          var readingDate = userReadingsSorted[0].createdAt.setHours(0, 0, 0, 0);
          var todayDate = new Date().setHours(0, 0, 0, 0);

          if(readingDate === todayDate){

            var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("You already download the reading of today")
            return res.status(403).json(error)
          }

        }

        if (req.query.limit > 7) {
          req.query.limit = 7;
        }

        var readingsArray = userReadingsSorted.map(function(currentValue,index,arr) {
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
        return  res.json(err)
    })

  })

  .post(function(req,res) {

    var objectDeserialized = {}
    req.body.data.attributes.userId = req.params.userId

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body).
    then(function(deserialized) {

      objectDeserialized = deserialized
    if (deserialized.readingId === null) {
       var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("reading-id is missing")
       return res.status(422).json(error)
     }
     if (deserialized.userId === null) {
       var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("user-id is missing")
       return res.status(422).json(error)
     }
      return Reading.count({_id: deserialized.readingId}).exec()

    })
   .then(function(countReadings){

      if(countReadings <= 0){

        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("reading-id não corresponde a uma leitura")
        return res.status(403).json(error)
      }
     return User.count({_id: objectDeserialized.userId}).exec()

   }).then(function(countUsers){

         if(countUsers <= 0){

           var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("user-id não corresponde a um usuário")
           return res.status(403).json(error)
         }
         return UserReading.count({'userId': objectDeserialized.userId, 'readingId': objectDeserialized.readingId}).exec()
       })
    .then(function(countUserReadings){

         if(countUserReadings > 0) {
           var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("esse reading já pertence a esse usuário")
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

    if (req.body.data == null || req.body.data.attributes == null || Object.keys(req.body.data.attributes).length < 1) {
      var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("data:{ attributes: []} não contem nenhum dado a ser atualizado  ")
      return res.status(403).json(error)

    }

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body).then(function(deserialized) {

      var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('',deserialized)
      return UserReading.findOneAndUpdate({readingId: req.params.readingId},updateObj,{"new": true}).exec()

    }).then(function(userReading) {

      if (userReading.n < 1) {
        var error = objectSerializer.serializeSimpleErrorIntoJSONAPI("reading-id não corresponde a uma reading")
        return res.status(403).json(error)
      } else {
        //
        return res.json(objectSerializer.serializeObjectIntoJSONAPI(userReading))

      }

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
