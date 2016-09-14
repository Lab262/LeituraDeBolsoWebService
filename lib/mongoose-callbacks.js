var errorHelper = require('../lib/error-handler')

exports.callbackWithMessage = function(res,responseMessage){
    var callback = function(err) {
      errorHelper.errorHandler(err,req,res)
      return res.json({message:responseMessage})
    }
    return callback
}
