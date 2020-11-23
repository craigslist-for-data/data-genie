const { storeAccount } = require('../models/accounts')

async function createAccount(info) {
  try {
    // TO DO: Create account in auth

    // Create new account in DB
    const accountDetails = {
      username:info.username,
      name:info.name,
      email:info.email,
      phone:info.phone,
      linkedin:info.linkedin,
      github:info.github,
      ssrn:info.ssrn,
      org:info.org,
      title:info.title,
    }
    const accountId = storeAccount(accountDetails)
    return accountId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
  return
}

module.exports = {
  createAccount,
}
