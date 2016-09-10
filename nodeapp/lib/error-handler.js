

exports.errorHandler = function(err,req,res,next) {
  res.status(500).json({error: err});
};

exports.entityNotFoundError = function(req,res) {
  res.status(404).json({error: "Requested entity not found"});
};
