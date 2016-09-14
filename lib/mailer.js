var Config = require('../config/environment');
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("smtps://"+Config.email.username+":"+Config.email.password+"@smtp.gmail.com");

exports.sentMailVerificationLink = function(user,token) {
    var textLink = Config.server.protocol+Config.server.host+"/"+Config.email.verifyEmailUrl+"/"+token
    var from = Config.email.accountName+" Team<" + Config.email.username + ">"
    var mailbody = "<p>Thanks for Registering on "+Config.email.accountName+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='" + textLink + "'>Verification Link</a></p>"
    mail(from, user.email , "Account Verification", mailbody)
}

exports.sentMailForgotPassword = function(user, newPassword) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">"
    var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>email : "+user.email+" , password : "+newPassword+"</p>"
    mail(from, user.email , "Account new password", mailbody)

}

function mail(from, email, subject, mailbody){
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    }

    smtpTransport.sendMail(mailOptions, function(error) {
        if (error) {
            console.error(error)
        }
        smtpTransport.close();
    })
}
