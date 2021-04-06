const express = require('express')
const router = express.Router()
const { createAccount, loginAccount, getAccountDetails, getPublicAccountDetails } = require('../services/accounts')
const { authorizeLoginCredentials, authorizeAccessToken } = require('../middleware/auth')

// Create new Account
router.post('/register', async function (req, res) {
  try {
    const results = await createAccount(req.body)
    return res.send(results)
  } catch (err) {
    console.error(err)
    return res.status(400).json({error: 'Failed to create new account'})
  }
})

// Login
router.post('/login', authorizeLoginCredentials, async function (req, res) {
  try {
    const results = await loginAccount(req.body)
    return res.send(results)
  } catch (err) {
    console.error(err)
    return res.status(400).json({error: 'Failed to create new account'})
  }
})

// Get Account info
router.get('/:accountId', authorizeAccessToken, async function (req, res) {
  try {
    const accountDetails = await getAccountDetails(req.params.accountId)
    return res.send(accountDetails)
  } catch (err) {
    console.error(err)
    return res.status(400).json({error: 'Failed to fetch account details'})
  }
})

// Get Public Account info
router.get('/public/:accountId', async function (req, res) {
  try {
    const accountDetails = await getPublicAccountDetails(req.params.accountId)
    return res.send(accountDetails)
  } catch (err) {
    console.error(err)
    return res.status(400).json({error: 'Failed to fetch account details'})
  }
})

module.exports = router
