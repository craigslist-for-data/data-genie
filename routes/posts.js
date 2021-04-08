const express = require('express')
const router = express.Router()
const { createPost, getBatchedPosts, getIndividualPost } = require('../services/posts')
const { authorizeAccessToken, authorizeAccessTokenBody } = require('../middleware/auth')

// Create new post
router.post('/', authorizeAccessTokenBody, async function (req, res) {
  try {
    const id = await createPost(req.body)
    return res.send(`New Post created: "${req.body.topic}"`)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to create new post'})
  }
})


// Get Posts (paginated)
router.get('/', async function (req, res) {
  try {
    const postBatch = await getBatchedPosts(req.query.index, req.query.batchSize)
    return res.send(postBatch)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to fetch posts'})
  }
})

// Get Post
router.get('/:postId', async function (req, res) {
  try {
    const postDetails = await getIndividualPost(req.params.postId)
    return res.send(postDetails)
  } catch (err) {
    console.error(err)
    return res.status(500).json({error: 'Failed to fetch post details'})
  }
})

module.exports = router
