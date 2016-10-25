exports.deserializerJSONIntoObject = function(object, jsonBody) {
  for(var param in jsonBody) {
    if(jsonBody.hasOwnProperty(param)) {
      if (param in object) {
        object[param] = jsonBody[param]
      }
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

exports.serializeObjectIntoJSONAPI = function(object,totalLength,limit) {

  var JSONAPISerializer = require('jsonapi-serializer').Serializer;

  var emptyDataReturn =  {
    "data": [
    ]
  }

  if( Object.prototype.toString.call( object ) === '[object Array]' ) {
    if (object[0] == null) { return emptyDataReturn }
    var objectAttributes = Object.keys(object[0].constructor.schema.paths);
    var objectType = object[0].constructor.collection.name
  } else {
    if (object == null) { return emptyDataReturn }
    var objectAttributes = Object.keys(object.constructor.schema.paths);
    var objectType = object.constructor.collection.name
  }

  var ObjectSerializer = new JSONAPISerializer(objectType, {
    attributes: objectAttributes
  });

  var serialized = ObjectSerializer.serialize(object);

  if( Object.prototype.toString.call( object ) === '[object Array]' ) {

    var totalPages = (limit && totalLength) ? Math.ceil(totalLength/limit) : 0
    serialized.metadata = { total_pages: totalPages }
  }

  return serialized

}

exports.deserializeJSONAPIDataIntoObject = function(jsonApiData, callback) {

  var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

  return new Promise(function (fulfill, reject){
    var deserialized = new JSONAPIDeserializer({keyForAttribute: 'camelCase'}).deserialize(jsonApiData, function (err, deserialized) {
      if (err) reject(err);
      else fulfill(deserialized);

      if (callback) callback(deserialized);

    });
  });




}


exports.serializeSimpleErrorIntoJSONAPI = function(message, attribute) {


  var error = { "errors": [
    {
      "detail": message,
      "source": {
        "pointer": "data/attributes/"  + attribute
      }
    }
    ]
}

return error

}

exports.deserializeQueryPaginationIntoVariables = function(req) {

  var limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 0

  var skip = parseInt(req.query.page) ? parseInt(req.query.page) : 1
  skip = limit * (skip - 1)
  skip = skip >= 0 ? skip : 0

  delete req.query.page
  delete req.query.limit

  return {limit: limit, skip: skip}
}
