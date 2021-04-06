const { storeAccount, getAccountInfo, getAccountId } = require('../models/accounts')
const {sendEmail} = require('../models/emails.js')
const { storeAccessToken } = require('../models/auth')
const { hashPassword } = require('../utilities')
const jwt = require('jsonwebtoken')

async function createAccount(info) {
  try {
    // TO DO: Create account in auth
    const hashedPassword = hashPassword(info.password)
    info['password'] = hashedPassword
    // Create new account in DB
    const accountId = await storeAccount(info)
    // Store auth token
    const token = jwt.sign({ id: accountId }, hashedPassword)
    const expiration = new Date(Date.now() + 15552000000).toISOString()
    const accessTokenId = storeAccessToken({accountId:accountId,
                                            token:token,
                                            expiration:expiration})

    // Send registration email
    const msg = {
      to: info.email,
      from: 'craigslistfordata@gmail.com',
      subject: 'Welcome to Data Genie!',
      text: `Welcome to Data Genie! We're like the craigslist for data but better`,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    sendEmail(msg)
    // Return response
    return {
      accountId: accountId,
      username: info.username,
      hasToken: true,
      token: token,
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function loginAccount(credentials){
  const hashedPassword = hashPassword(credentials.password)
  const accountId = await getAccountId(credentials.username)
  const token = jwt.sign({ id: accountId }, hashedPassword)
  const expiration = new Date(Date.now() + 15552000000).toISOString()
  const accessTokenId = storeAccessToken({accountId:accountId,
                                          token:token,
                                          expiration:expiration})
  return {
    accountId:accountId,
    username:credentials.username,
    hasToken: true,
    token: token,
  }
}

async function getAccountDetails(id){
  try {
    const accountDetails = await getAccountInfo(id)
    return {
      accountId:accountDetails.id,
      username:accountDetails.username,
      name:accountDetails.name,
      email:accountDetails.email,
      phone:accountDetails.phone,
      linkedin:accountDetails.linkedin,
      github:accountDetails.github,
      ssrn:accountDetails.ssrn,
      org:accountDetails.org,
      title:accountDetails.title,
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  createAccount,
  loginAccount,
  getAccountDetails,
}
