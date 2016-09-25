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

exports.serializeObjectIntoJSONAPI = function(object) {

  var JSONAPISerializer = require('jsonapi-serializer').Serializer;


  if (object === null || object[0] == null ) {
    return  {
      "data": [      
      ]
    }
  }

  if( Object.prototype.toString.call( object ) === '[object Array]' ) {
    var objectAttributes = Object.keys(object[0].toObject());
    var objectType = object[0].constructor.collection.name
  } else {
    var objectAttributes = Object.keys(object.toObject());
    var objectType = object.constructor.collection.name
  }
  var ObjectSerializer = new JSONAPISerializer(objectType, {
    attributes: objectAttributes
  });

  var serialized = ObjectSerializer.serialize(object);
  return serialized

}
