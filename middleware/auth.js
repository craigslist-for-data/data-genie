const { getPassword, verifyAccessToken, getLoginId } = require('../models/auth')
const { getAccountInfo } = require('../models/accounts')
const { hashPassword } = require('../utilities')
const bcrypt = require('bcrypt')

async function verifyLoginCredentials(req, res, next) {
  try {
    const password = req.body.password
    const username = req.body.username
    const hashedPassword = await getPassword(username)
    const verified = bcrypt.compareSync(password, hashedPassword.password)
    if (verified) {
      next()
    } else {
      res.status(401).send('Invalid login credentials')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Unable to authorize login credentials')
  }
}

async function authorizeAccessToken(req, res, next) {
  try {
    const accountId = req.params.id
    const account = await getAccountInfo(accountId)
    const username = account.username
    const login = await getLoginId(username)
    const loginId = login.id
    const token = req.header('token')
    const verified = await verifyAccessToken({loginId:loginId,
                                              token:token})
    if (!Boolean(verified)) {
      res.status(401).send('Invalid access token')
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Unable to authorize access token')
  }
}

module.exports = {
  verifyLoginCredentials,
  authorizeAccessToken,
}
