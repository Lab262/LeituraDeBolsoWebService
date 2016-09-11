var chai = require('chai')
var expect = chai.expect // we are using the "expect" style of Chai
var ObjectSerializer = require('./../../../lib/object-serializer')
var User = require('./../../../models/v0/User')
var sinon = require('sinon')

describe('ObjectSerializer', function() {
    // beforeEach(function() {
    //   sinon.stub(user,'save', function(err, user) {
    //     setTimeout( function() {
    //       done({
    //
    //       })
    //     },0)
    //   })
    // })

    // afterEach(function() {
    //   user.save.restore()
    // })
    it('deserializerJSONIntoObject() should return a filled object with json params', function() {
        var user = new User()
        var jsonObj = { name: "Thiago", email: "tmb0710@gmail.com", password: "12345", uknownProperty: "none"}
        user = ObjectSerializer.deserializerJSONIntoObject(user,jsonObj)
        user.save()
        expect(user.name).to.equal(jsonObj['name'])

    })
})
