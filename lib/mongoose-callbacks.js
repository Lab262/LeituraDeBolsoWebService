
exports.callbackWithMessage = function(responseMessage){
    var callback = function(err) {
      errorHelper.errorHandler(err,req,res)
      return res.json({message:responseMessage})
    }
    return callback
}
