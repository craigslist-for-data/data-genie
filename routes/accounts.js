const express = require('express')
const router = express.Router()
const { createAccount, loginAccount, getAccountDetails } = require('../services/accounts')

// Create new Account
router.post('/register', async function (req, res) {
  try {
    const results = await createAccount(req.body)
    return res.send(results)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new account'})
  }
})

// Login
router.post('/login', async function (req, res) {
  try {
    const results = await loginAccount(req.body)
    return res.send(results)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new account'})
  }
})

// Get Account info
router.get('/:id', async function (req, res) {
  try {
    const accountDetails = await getAccountDetails(req.params.id)
    return res.send(accountDetails)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to fetch account details'})
  }
})

module.exports = router
