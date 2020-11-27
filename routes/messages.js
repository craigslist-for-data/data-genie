const express = require('express')
const router = express.Router()
const {  } = require('../services/messages')

// Create new message
router.post('/:threadId', async function (req, res) {
  try {
    const id = await createPost(req.params.threadId, req.body)
    return res.send(`New Post created: "${req.body.topic}"`)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new post'})
  }
})


// Get messages in thread
router.get('/:threadId', async function (req, res) {
  try {
    const messages = await getMessages(req.params.id)
    return res.send(messages)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to fetch messages'})
  }
})


module.exports = router
