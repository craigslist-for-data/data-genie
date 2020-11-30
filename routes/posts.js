const express = require('express')
const router = express.Router()
const { createPost, getBatchedPosts, getIndividualPost } = require('../services/posts')

// Create new post
router.post('/', async function (req, res) {
  try {
    const id = await createPost(req.body)
    return res.send(`New Post created: "${req.body.topic}"`)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to create new post'})
  }
})


// Get Posts (paginated)
router.get('/', async function (req, res) {
  try {
    const postBatch = await getBatchedPosts(req.query.index, req.query.batchSize)
    return res.send(postBatch)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to fetch posts'})
  }
})

// Get Post
router.get('/:postId', async function (req, res) {
  try {
    const postDetails = await getIndividualPost(req.params.postId)
    return res.send(postDetails)
  } catch (err) {
    throw new Error(err)
    return res.status(400).json({error: 'Failed to fetch post details'})
  }
})

module.exports = router
