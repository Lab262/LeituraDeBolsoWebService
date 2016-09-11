var nodemailer = require("nodemailer"),
    Config = require('../config/environment')
    
// create reusable transport method (opens pool of SMTP connections)
// console.log(Config.email.username+"  "+Config.email.password)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: Config.email.username,
        pass: Config.email.password
    }
})


exports.sentMailVerificationLink = function(user,token) {
    var textLink = "http://"+Config.server.host+":"+ Config.server.port+"/"+Config.email.verifyEmailUrl+"/"+token
    var from = Config.email.accountName+" Team<" + Config.email.username + ">"
    var mailbody = "<p>Thanks for Registering on "+Config.email.accountName+" </p><p>Please verify your email by clicking on the verification link below.<br/><a href='" + textLink + "'>Verification Link</a></p>"
    mail(from, user.email , "Account Verification", mailbody)
}

exports.sentMailForgotPassword = function(user, newPassword) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">"
    var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>email : "+user.email+" , password : "+newPassword+"</p>"
    mail(from, user.email , "Account new password", mailbody)

}

// exports.sentMailForgotPassword = function(user) {
//     var from = Config.email.accountName+" Team<" + Config.email.username + ">"
//     var mailbody = "<p>Your "+Config.email.accountName+"  Account Credential</p><p>email : "+user.email+" , password : "+decrypt(user.password)+"</p>"
//     mail(from, user.username , "Account password", mailbody)
// }


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
        smtpTransport.close()  // shut down the connection pool, no more messages
    })
}
