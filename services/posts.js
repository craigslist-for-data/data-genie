const { storePost, getPost, getPostsBatch } = require('../models/posts')
const { getAccountInfo } = require('../models/accounts')

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
    const postsBatch = await getPostsBatch(index, batchSize)
    const posts = await Promise.all(postsBatch.map(async (post) => {
      const accountInfo = await getAccountInfo(post.account_id)
      post['username'] = accountInfo.username
      return post
    }))
    return posts
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get individual Post
async function getIndividualPost(id){
  try {
    const postDetails = await getPost(id)
    const accountInfo = await getAccountInfo(postDetails.account_id)
    postDetails['username'] = accountInfo.username
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
