var errorHelper = require('../lib/error-handler')

exports.callbackWithMessage = function(res,req,responseMessage){
    var callback = function(err) {
      errorHelper.errorHandler(err,req,res)

      return res.status(200).json({message: responseMessage})
    }
    return callback
}
