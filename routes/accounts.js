const express = require('express')
const router = express.Router()
const { createAccount, getAccountDetails } = require('../services/accounts')

// Create new Account
router.post('/', async function (req, res) {
  try {
    const accountId = await createAccount(req.body)
    return res.send(`New Account created for ${req.body.username}!`)
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
