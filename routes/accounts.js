const express = require('express');
const router = express.Router();
const { createAccount } = require('../services/accounts')

// Create new account
router.post('/', async function (req, res) {
  const account = await createAccount(req.body)
  res.send('Connected!');
})

module.exports = router
