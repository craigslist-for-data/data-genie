const { storeAccount, getAccountInfo, getAccountId } = require('../models/accounts')
const {sendEmail} = require('../models/emails.js')
const { storeLoginCredentials, storeAccessToken, getLoginInfo } = require('../models/auth')
const { hashPassword } = require('../utilities')
const jwt = require('jsonwebtoken')

async function createAccount(info) {
  try {
    // TO DO: Create account in auth
    const hashedPassword = hashPassword(info.password)
    const loginId = await storeLoginCredentials({username: info.username,
                                                password: hashedPassword})
    const token = jwt.sign({ id: loginId }, hashedPassword)
    const expiration = new Date(Date.now() + 1800000).toISOString()
    const accessTokenId = storeAccessToken({loginId:loginId,
                                            token:token,
                                            expiration:expiration})

    // Create new account in DB
    const accountId = await storeAccount(info)
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
  const login = await getLoginInfo(credentials.username)
  const hashedPassword = hashPassword(credentials.password)
  const token = jwt.sign({ id: login.id }, hashedPassword)
  const expiration = new Date(Date.now() + 1800000).toISOString()
  const accessTokenId = storeAccessToken({loginId:login.id,
                                          token:token,
                                          expiration:expiration})
  const accountId = await getAccountId(credentials.username)
  return {
    accountId:accountId,
    username:credentials.username,
    auth: true,
    token: token,
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
  loginAccount,
  getAccountDetails,
}
