const { storeAccount, getAccountInfo } = require('../models/accounts')

async function createAccount(info) {
  try {
    // TO DO: Create account in auth

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
