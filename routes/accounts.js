const express = require('express');
const router = express.Router();
const { createAccount } = require('../services/accounts')

// Create new account
router.post('/', async function (req, res) {
  try {
    const account = await createAccount(req.body)
    return res.send(`New Account created for ${req.body.username}!`)
  } catch (err) {
    return res.status(400).json({error: 'Failed to create new account'})
  }
})

module.exports = router
