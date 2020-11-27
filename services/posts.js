const { storePost, getPost, getPostsBatch } = require('../models/posts')

// Create new post
async function createPost(info) {
  try {
    // Create new post in DB
    const postId = storePost(info)
    return postId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get batch of Posts
async function getBatchedPosts(index, batchSize){
  try {
    const postBatch = getPostsBatch(index, batchSize)
    return postBatch
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get individual Post
async function getIndividualPost(id){
  try {
    const postDetails = getPost(id)
    return postDetails
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  createPost,
  getBatchedPosts,
  getIndividualPost,
}
