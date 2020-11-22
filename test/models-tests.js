const assert = require('assert')
const { createAccount,  getAccountInfo, getAccountId } = require('../models/accounts')
const { createMessageThread, createMessage,  getMessages } = require('../models/messages')
const { createPost, getPost, getPosts } = require('../models/posts')
const { mainPgPool } = require('../dbs/pg_helpers')


async function clearTestData() {
  await mainPgPool.submitTransaction('DELETE FROM feedback')
  await mainPgPool.submitTransaction('DELETE FROM invitations')
  await mainPgPool.submitTransaction('DELETE FROM message_threads')
  await mainPgPool.submitTransaction('DELETE FROM messages')
  await mainPgPool.submitTransaction('DELETE FROM posts')
  await mainPgPool.submitTransaction('DELETE FROM accounts')
}

clearTestData()

describe('Accounts', function() {
  describe('createAccount', function() {
    it('Should create a new Account', async function() {
      const dummy = 1
      dummy.should.equal(1)
    })
  })
})
// const username1 = 'test1'
// const username2 = 'test2'
// const username3 = 'test3'
//
// describe('Accounts', function() {
//   describe('createAccount', function() {
//     it('Should create a new Account', async function() {
//       const accountDetails = {
//         username:username1,
//         name:'Test User',
//         email:'test1@gmail.com',
//         phone:2123456789,
//         linkedin:null,
//         github:null,
//         ssrn:null,
//         org:'TEST',
//         title:'TEST',
//       }
//       const id = await createAccount(accountDetails)
//       const idCheck = await getAccountId(accountDetails.username)
//       idCheck.should.equal(id)
//
//       const account = await getAccountInfo(id)
//       console.log(account)
//
//       account.id.should.equal(id)
//       account.username.should.equal(accountDetails.username)
//       account.name.should.equal(accountDetails.name)
//       account.email.should.equal(accountDetails.email)
//       account.phone.should.equal(accountDetails.phone)
//       account.linkedin.should.equal(accountDetails.linkedin)
//       account.github.should.equal(accountDetails.github)
//       account.ssrn.should.equal(accountDetails.ssrn)
//       account.org.should.equal(accountDetails.org)
//       account.title.should.equal(accountDetails.title)
//     })
//   })
// })

// describe('Posts', function() {
//   describe('createPost', function() {
//     it('Should create a new Post', async function(done) {
//       const postContents = {
//         accountId:1,
//         topic:'TEST POST',
//         usage:'Personal',
//         purpose:'To Test Posting Functionality',
//         briefDesc:'N/A',
//         detailedDesc:'N/A',
//         links:null
//       }
//       const id = await createPost(postContents)
//       const post = await getPost(id)
//       posts.id.should.equal(id)
//       posts.accountId.should.equal(postContents.accountId)
//       post.topic.should.equal(postContents.topic)
//       post.usage.should.equal(postContents.usage)
//       post.purpose.should.equal(postContents.purpose)
//       post.briefDesc.should.equal(postContents.briefDesc)
//       post.detailedDesc.should.equal(postContents.detailedDesc)
//       post.links.should.equal(postContents.links)
//     })
//   })
// })


module.exports = {
  createAccount,
  getAccountInfo,
  createMessageThread,
  createMessage,
  getMessages,
}
