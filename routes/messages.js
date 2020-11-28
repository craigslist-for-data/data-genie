const express = require('express')
const router = express.Router()
const { createThread, getMessageThreads, sendMessage, getMessages } = require('../services/messages')

// Create new thread
router.post('/threads', async function (req, res) {
  try {
    const id = await createThread(req.body.users)
    return res.send(`New Thread created ${id}"`)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new thread'})
  }
})

// Get message threads for account
router.get('/threads/:accountId', async function (req, res) {
  try {
    const threads = await getMessageThreads(req.params.accountId)
    return res.send(threads)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: `Failed to get message threads for account ${accountId}`})
  }
})

// Create new message
router.post('/', async function (req, res) {
  try {
    const id = await sendMessage(req.body)
    return res.send(`Message ${id} created!`)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new post'})
  }
})


// Get messages in thread
router.get('/:threadId', async function (req, res) {
  try {
    const messages = await getMessages(req.params.threadId)
    return res.send(messages)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to fetch messages'})
  }
})


module.exports = router
