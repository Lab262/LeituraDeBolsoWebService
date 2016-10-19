

exports.errorHandler = function(err,req,res) {
  if (err) {
      return res.status(500).json(err)
  }
}

exports.entityNotFoundError = function(req,res) {
  return res.status(404).json({error: "Requested entity not found"})
}
