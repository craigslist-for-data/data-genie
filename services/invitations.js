const { storeInvitation} = require('../models/invitations')
const {sendEmail} = require('./models/emails.js')

async function sendInvitation(info) {
  try {
    // TO DO: Send an email to invite someone to use the site
    const msg = {
      to: info.email,
      from: 'craigslistfordata@gmail.com',
      subject: `You're Invited to Data Genie!`,
      text: 'Your friend invited you to use Data Genie',
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sendEmail(msg)

    // Submit feedback in DB
    const id = storeInvitation(info)
    return id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  sendInvitation,
}
