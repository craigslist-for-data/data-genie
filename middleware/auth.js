const { getPassword, getAccessTokenAccountInfo } = require('../models/auth')
const { getAccountId, getAccountInfo } = require('../models/accounts')
const { getAccounts } = require('../models/messages')
const { hashPassword } = require('../utilities')
const bcrypt = require('bcrypt')

async function authorizeLoginCredentials(req, res, next) {
  try {
    const password = req.body.password
    const username = req.body.username
    const hashedPassword = await getPassword(username)
    const verified = bcrypt.compareSync(password, hashedPassword)
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

async function authorizeAccessToken(req, res, next){
  try {
    const token = req.header('token')
    const loginInfo = await getAccessTokenAccountInfo(token)
    if (!Boolean(loginInfo)){
      res.status(401).send(`Invalid access token`)
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    throw new Error('Unable to authorize access token')
  }
}

async function authorizeAccessTokenParams(req, res, next){
  try {
    const token = req.header('token')
    const accountId = req.params.accountId
    const loginInfo = await getAccessTokenAccountInfo(token)
    if (!Boolean(loginInfo)){
      res.status(401).send(`Invalid access token`)
    }
    if (loginInfo.id!=accountId){
      res.status(401).send(`Invalid access token for account`)
    }
    next()
  } catch (err) {
    console.error(err)
    throw new Error('Unable to authorize access token')
  }
}

async function authorizeAccessTokenBody(req, res, next){
  try {
    const token = req.header('token')
    const accountId = req.body.accountId
    const loginInfo = await getAccessTokenAccountInfo(token)
    if (!Boolean(loginInfo)){
      res.status(401).send(`Invalid access token`)
    }
    if (loginInfo.id!=accountId){
      res.status(401).send(`Invalid access token for account`)
    }
    next()
  } catch (err) {
    console.error(err)
    throw new Error('Unable to authorize access token')
  }
}

async function authorizeAccessTokenForMessageThread(req, res, next){
  try {
    const token = req.header('token')
    const loginInfo = await getAccessTokenAccountInfo(token)
    if (!Boolean(loginInfo)){
      res.status(401).send(`Invalid access token`)
    }
    const accountId = loginInfo.id
    const threadId = req.params.threadId
    const threadAccounts = await getAccounts(threadId)
    const threadAccess = threadAccounts.filter(row => row.account_id==accountId)
    if (threadAccess.length==0){
      res.status(401).send(`Invalid access token for thread`)
    }
    next()
  } catch (err) {
    console.error(err)
    throw new Error('Unable to authorize access token')
  }
}

module.exports = {
  authorizeLoginCredentials,
  authorizeAccessToken,
  authorizeAccessTokenParams,
  authorizeAccessTokenBody,
  authorizeAccessTokenForMessageThread,
}
