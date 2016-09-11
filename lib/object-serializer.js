exports.deserializerJSONIntoObject = function(object, jsonBody) {
  for(var param in jsonBody) {
    if(jsonBody.hasOwnProperty(param)) {
      object[param] = jsonBody[param]
    }
  }
  return object
}

exports.deserializerJSONAndCreateAUpdateClosure = function(childSet, jsonBody) {
  var updateObj = {$set: {}}
  for(var param in jsonBody) {
    if (jsonBody.hasOwnProperty(param)) {
      updateObj.$set[childSet+param] = jsonBody[param]
    }
  }
  return updateObj
}
