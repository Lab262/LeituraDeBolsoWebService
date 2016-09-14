module.exports = {

    'secret': ',9@4gk8+nYw,3EL2{Law7vzFZE46Ni&An=(88bY/Rpno$vnLbY',
    database: {
      production: "none",
      development: "mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso",
      test: "mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso"
    },
      email: {
       username: "leituradebolsoapp@gmail.com",
       password: "leitura123",
       accountName: "Leitura de bolso",
       verifyEmailUrl: "api/v0/auth/verifyEmail"
     },
     server: {
           protocol: "http://",
           host: "leituradebolso.herokuapp.com",
           port: 8080
   },
   facebook: {
     passwordSecret: "A QWgd$j[QGe]Bh.Ugkf>?B3y696?2$#B2xwfN3hrVhFrE348g"
   }
}
