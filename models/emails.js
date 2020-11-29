const sgMail = require('@sendgrid/mail')
const secrets = require('../secrets.js')
sgMail.setApiKey(SENDGRID_API_KEY)

async function sendEmail(msg) {
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = {
  sendEmail,
}
