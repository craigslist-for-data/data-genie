const express = require('express')
const router = express.Router()
const { createMessageThread, getMessageThreads, sendMessage, getMessages } = require('../services/messages')
const { getAccountIdFromAccessToken } = require('../services/auth')
const {
  authorizeAccessToken,
  authorizeAccessTokenBody,
  authorizeAccessTokenForMessageThread,
} = require('../middleware/auth')

// Create new thread
router.post('/threads', authorizeAccessTokenBody, async function (req, res) {
  try {
    const result = await createMessageThread(req.body)
    return res.send(result)
  } catch (err) {
    console.error(error)
    return res.status(500).json({error: 'Failed to create new thread'})
  }
})

// Get message threads for account
router.get('/threads/', authorizeAccessToken, async function (req, res) {
  try {
    const accountId = await getAccountIdFromAccessToken(req.header('token'))
    const threads = await getMessageThreads(accountId)
    return res.send(threads)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: `Failed to get message threads for account ${accountId}`})
  }
})

// Create new message
router.post('/', authorizeAccessTokenBody, async function (req, res) {
  try {
    const id = await sendMessage(req.body)
    return res.send(`Message ${id} created!`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to create new post'})
  }
})

// Get messages in thread
router.get('/:threadId', authorizeAccessTokenForMessageThread, async function (req, res) {
  try {
    const messages = await getMessages(req.params.threadId)
    return res.send(messages)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to fetch messages'})
  }
})


module.exports = router
