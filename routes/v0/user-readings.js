var User = require('../../models/v0/user')
var Reading = require('../../models/v0/reading')
var express = require('express')
var router = express.Router()
var errorHelper= require('../../lib/error-handler')
var objectSerializer = require('../../lib/object-serializer')


router.route('/users/:userId/readingsOfTheWeek')

  .get(function(req,res) {

    User.findOne({ _id: req.params.userId}).select('readings.readingId').exec().then(
    function(user) {

      var readingsArray = user.readings.map(function(currentValue,index,arr) {
          return currentValue.readingId
      })

      var query = {
        "_id": { "$nin": readingsArray }
      }

      Reading.find(query).skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit)).sort({ readOfTheWeek: 'descending'}).exec().then(
        function(reading){
          return  res.json(reading)

      },function(err) {
        return  res.json(err)

      })

    },
    function(err) {
        return  res.json(err)
    })

  })

router.route('/users/:userId/readings')

  .get(function(req,res) {
    var callback =  function(err,user) {
      if (user === null) {
        return res.status(404).json({message: "user not found"})
      }
      res.json(user)
      var serialized = objectSerializer.serializeObjectIntoJSONAPI(user)

        res.json(serialized)
        console.log(serialized)
    }
    User.findOne({ _id: req.params.userId}).select('readings').exec(callback)
  })

  .post(function(req,res) {

    var callBack = function(deserialized) {
    //  console.log(req.body)

      if (deserialized.readingId === null) {
        return res.status(422).json({message: "readingId is missing"})
      }
      Reading.count({_id: deserialized.readingId}, function (err, count){
        if(count <= 0){
          return res.status(403).json({message: "readingId not corresponds to any reading"})
        }
          User.findOne({ _id: req.params.userId },function(err,user) {
            if(!user || user.readings === null) {
              return res.status(403).json({message: "user.readings is null"})
            }



            var userReading = user.readings.filter(function (reading) { return reading.readingId === deserialized.readingId})
            if (userReading.length > 0) {
              return res.status(403).json({message: "_readingId is already in use for this user"})
            }

            console.log(deserialized)

            User.update( {id: req.params.userID},{
              $addToSet: {
                readings:{
                  $each: [deserialized]}
                }},
                {upsert:true},
                function (err) {
                  return res.status(201).json({message: 'User reading succefully created'})
                }
              )
            })
          })
    }

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)


      })

  .delete(function(req,res) {
    User.update(
      {_id: req.params.userId},
      { $set:
        {'readings':
          []
         }
       },
       function(err) {
         if (err) {
           errorHelper.erorHandler(err,req,res)
         } else {
           return res.status(204).json({message: "user-readings successufully deleted"})
         }
       })
  })

router.route('/users/:userId/readings/:readingId')
  .get(function(req,res) {
    User.findOne({ _id: req.params.userId},function(err,user) {
      if(!user) {
        errorHelper.entityNotFoundError(req,res)
      }
      var reading = user.readings.filter(function (reading) { return reading.readingId === req.params.readingId})

      var serialized = objectSerializer.serializeObjectIntoJSONAPI(reading)

      return res.json(serialized)
    })
  })

  .patch(function(req,res) {

    var callBack = function(deserialized) {

      var updateObj = objectSerializer.deserializerJSONAndCreateAUpdateClosure('readings.$.',deserialized)
      console.log("LOG MAROTO ======");
      console.log(updateObj);

      User.update(
        { _id: req.params.userId,
          'readings.readingId': req.params.readingId},
          updateObj,
          function(err) {
            console.log("LOG MAROTO ======");
            console.log(err);

            if (err) {
              return res.status(403).json(err);
            }

            return res.status(200).json({"message": "user-reading successfully updated"});
          })

    }

    objectSerializer.deserializeJSONAPIDataIntoObject(req.body,callBack)

  })

  .delete(function(req,res) {
    User.update(
      {_id: req.params.userId},
      { $pull:
        {'readings':
           {_readingId: req.params.readingId}
         }
       },
       function(err) {
         if (err) {
           errorHelper.erorHandler(err,req,res)
         } else {
           return res.status(204).json({message: 'user-reading successufully deleted'})
         }
       })
  })


module.exports = router
