const express = require('express')
const router = express.Router()
const { sendInvitation } = require('../services/invitations')

// Send new Invite
router.post('/', async function (req, res) {
  try {
    const feedbackId = await sendInvitation(req.body)
    return res.send(`Your invitation has been sent!`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to send invitations :('})
  }
})

module.exports = router
