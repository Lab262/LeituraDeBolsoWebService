
function databaseHost() {
  switch (process.env.NODE_ENV) {
    case 'development':
    return  "mongodb://developers:Ufu-2Ss-W95-Az3@ds049624.mlab.com:49624/leituradebolso-stagging"
    case 'staging':
    return "mongodb://developers:Ufu-2Ss-W95-Az3@ds049624.mlab.com:49624/leituradebolso-stagging"
    case 'production':
    return "mongodb://developers:Ufu-2Ss-W95-Az3@ds147985.mlab.com:47985/leituradebolso"
    case 'test':
    return "mongodb://developers:Ufu-2Ss-W95-Az3@ds021356.mlab.com:21356/leituradebolso-localtest"
    default :
    return ''
  }
  return process.env.NODE_ENV
}

function serverProtocolAndHost() {
  switch (process.env.NODE_ENV) {
    case 'development':
    return {
      protocol: "http://",
      host: "leituradebolso-stagging.herokuapp.com",
    }
    case 'staging':
    return {
      protocol: "http://",
      host: "leituradebolso-stagging.herokuapp.com",
    }
    case 'production':
    return  {
      protocol: "http://",
      host: "leituradebolso-production.herokuapp.com",
    }
    case 'test':
    return "localhost:8080"
    default :
    return ''
  }
  return process.env.NODE_ENV
}

module.exports = {

  'secret': ',9@4gk8+nYw,3EL2{Law7vzFZE46Ni&An=(88bY/Rpno$vnLbY',
  database: {
    host: databaseHost()
  },
  email: {
    username: "leituradebolsoapp@gmail.com",
    password: "leitura123",
    accountName: "Leitura de bolso",
    verifyEmailUrl: "api/v0/auth/verifyEmail",
    forgotPasswordConfirmedUrl: "api/v0/auth/forgotPasswordConfirmed"

  },
  server: serverProtocolAndHost(),
  facebook: {
    passwordSecret: "AQWgd$j[QGe]Bh.Ugkf>?B3y696?2$#B2xwfN3hrVhFrE348g"
  }
}
