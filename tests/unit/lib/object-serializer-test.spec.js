var chai = require('chai')
var expect = chai.expect // we are using the "expect" style of Chai
var ObjectSerializer = require('./../../../lib/object-serializer')
var User = require('./../../../models/v0/user')
var sinon = require('sinon')
var mongooseTestSetup = require('./../../setup/mongoose-test-setup')

describe('ObjectSerializer', function() {

    it('deserializerJSONIntoObject() should return a filled object with json params', function(done) {
        var user = new User()
        var jsonObj = { name: "Thiago", email: "tmb0710@gmail.com", password: "12345", uknownProperty: "none"}
        user = ObjectSerializer.deserializerJSONIntoObject(user,jsonObj)
        user.save(function(err){
          expect(user.name).to.equal(jsonObj['name'])
          expect(user.email).to.equal(jsonObj['email'])
          expect(user.password).to.not.equal(jsonObj['password'])
          done(err)
        })
    })

    it('deserializerJSONAndCreateAUpdateClosure() should return a filled update closure with json params', function() {
        var jsonObj = { name: "Thiago", email: "tmb0710@gmail.com", password: "12345", uknownProperty: "none"}
        var updateClosure = ObjectSerializer.deserializerJSONAndCreateAUpdateClosure("users.$.",jsonObj)
          expect(updateClosure.$set["users.$.name"]).to.equal(jsonObj['name'])
          expect(updateClosure.$set["users.$.email"]).to.equal(jsonObj['email'])
          expect(updateClosure.$set["users.$.password"]).to.equal(jsonObj['password'])
    })

})
