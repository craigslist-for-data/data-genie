const { getAccessTokenLoginInfo } = require('../models/auth')
const { getAccountId } = require('../models/accounts')

async function getAccountIdFromAccessToken(accessToken){
  try {
    const loginInfo = await getAccessTokenLoginInfo(accessToken)
    const accountId = await getAccountId(loginInfo.username)
    return accountId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  getAccountIdFromAccessToken
}
