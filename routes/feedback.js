const express = require('express')
const router = express.Router()
const { submitFeedback } = require('../services/feedback')

// Create new Account
router.post('/', async function (req, res) {
  try {
    const feedbackId = await submitFeedback(req.body)
    return res.send(`Thanks for your feedback!`)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to submit feedback'})
  }
})

module.exports = router
