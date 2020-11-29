const { storeAccount, getAccountInfo } = require('../models/accounts')
const {sendEmail} = require('../models/emails.js')

async function createAccount(info) {
  try {
    // TO DO: Create account in auth

    const msg = {
      to: info.email,
      from: 'craigslistfordata@gmail.com',
      subject: 'Welcome to Data Genie!',
      text: `Welcome to Data Genie! We're like the craigslist for data but better`,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sendEmail(msg)

    // Create new account in DB
    const accountId = storeAccount(info)
    return accountId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getAccountDetails(id){
  try {
    const accountDetails = getAccountInfo(id)
    return accountDetails
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  createAccount,
  getAccountDetails,
}
