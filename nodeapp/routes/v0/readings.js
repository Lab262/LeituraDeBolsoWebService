var Reading = require('../../models/v0/reading');
var express = require('express');
var router = express.Router();

router.route('/readings')

  .get(function(req,res) {

    Reading.find(function(err,readings) {
      if (err) {
        return res.send(err);
      }

      res.json(readings);

    });
  })

  .post(function(req,res) {
    var reading = new Reading(req.body);

    reading.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.send({message: 'Reading added'});
    });

  })

router.route('/readings/:id')

  .put(function(req,res) {
    Reading.findOne({ _id: req.params.id}, function(err, reading) {
      if (err) {
        return res.send(err);
      } else if (reading == null) {
        return res.status(404);
      }

      for (prop in req.body) {
        reading[prop] = req.body[prop]
      }

      reading.save(function(err) {
        if(err) {
          return res.send(err);
        }

        res.json({ message: 'Reading Updated'})
      });

    });
  })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,reading) {
      if (err) {
        return res.send(err);
      }
      res.json(reading);
    });
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    }, function(err,reading) {
      if(err){
        return res.send(err);
      }
      res.json({message: 'Successufully deleted'});
    });
  })

module.exports = router;
