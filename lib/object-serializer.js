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

exports.serializeObjectIntoJSONAPI = function(object) {

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
  return serialized

}

exports.deserializeJSONAPIDataIntoObject = function(jsonApiData, callback) {

  var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
  var deserialized = new JSONAPIDeserializer({keyForAttribute: 'camelCase'}).deserialize(jsonApiData, function (err, deserialized) {
     callback(deserialized)
  });

}
