const { storeInvitation} = require('../models/invitations')

async function sendInvitation(info) {
  try {
    // TO DO: Send an email to invite someone to use the site

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
