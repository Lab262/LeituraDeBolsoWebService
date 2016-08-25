var Reading = require('../../models/v0/readings');
var express = require('express');
var router = express.Router();

router.route('/readings')

  .get(function(req,res) {

    Reading.find(function(err,Readings) {
      if (err) {
        return res.send(err);
      }

      res.json(Readings);

    });
  })

  .post(function(req,res) {
    var Reading = new Reading(req.body);

    Reading.save(function(err) {
      if (err) {
        return res.send(err);
      }
      res.send({message: 'Reading added'});
    });

  })

router.route('/Readings/:id')

  .put(function(req,res) {
    Reading.findOne({ _id: req.params.id}, function(err, Reading) {
      if (err) {
        return res.send(err);
      }

      for (prop in req.body) {
        Reading[prop] = req.body[prop]
      }

      Reading.save(function(err) {
        if(err) {
          return res.send(err);
        }

        res.json({ message: 'Reading Updated'})
      });

    });
  })

  .get(function(req,res) {
    Reading.findOne({ _id: req.params.id},function(err,movie) {
      if (err) {
        return res.send(err);
      }
      res.json(movie);
    });
  })

  .delete(function(req,res) {
    Reading.remove({
      _id: req.params.id
    }, function(err,movie) {
      if(err){
        return res.send(err);
      }
      res.json({message: 'Successufully deleted'});
    });
  })

module.exports = router;
