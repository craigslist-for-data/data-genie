const should = require('chai').should()
const { createAccount,  getAccountInfo, getAccountId } = require('../models/accounts')
const { createMessageThread, createMessage,  getMessages } = require('../models/messages')
const { createPost, getPost, getPosts } = require('../models/posts')
const { mainPgPool } = require('../dbs/pg_helpers')

// CLEAR ALL TEST DATA BEFORE PROCEEDING
describe('Clear DB Data', function() {
  it('Should clear test data', async function() {
    await mainPgPool.submitTransaction('DELETE FROM feedback')
    await mainPgPool.submitTransaction('DELETE FROM invitations')
    await mainPgPool.submitTransaction('DELETE FROM message_threads')
    await mainPgPool.submitTransaction('DELETE FROM messages')
    await mainPgPool.submitTransaction('DELETE FROM posts')
    await mainPgPool.submitTransaction('DELETE FROM accounts')
  })
})

const username = 'test1'

describe('Accounts DB Tests', function() {
  it(`Should...
      1. Create an Account in DB
      2. Fetch the Account id using username
      3. Match DB Account info with account test info`, async function() {
    const accountDetails = {
      username:username,
      name:'Test User1',
      email:'test1@gmail.com',
      phone:2123456780,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    // CREATE NEW ACCOUNT IN DB
    const id = await createAccount(accountDetails)
    // GET NEW ACCOUNT ID FROM USERNAME
    const accountId = await getAccountId(accountDetails.username)
    // ENSURE IDS MATCH
    accountId.should.equal(id)

    // GET ACCOUNT INFO FROM ID
    const account = await getAccountInfo(id)
    // ENSURE ACCOUNT INFORMATION MATCHES WHAT WAS INSERTED INTO THE DB
    account.id.should.equal(id)
    account.username.should.equal(accountDetails.username)
    account.name.should.equal(accountDetails.name)
    account.email.should.equal(accountDetails.email)
    account.phone.should.equal(accountDetails.phone)
    should.not.exist(account.linkedin)
    should.not.exist(account.github)
    should.not.exist(account.ssrn)
    account.org.should.equal(accountDetails.org)
    account.title.should.equal(accountDetails.title)
  })
})

describe('Posts DB', function() {
  it(`Should...
      1. Create a new Post in DB
      2. Get Post using id
      3. Return correct Post content
      4. Return batches of Posts`, async function() {
    // GET ACCOUNT FROM USERNAME
    const accountId = await getAccountId(username)
    const postContents = {
      accountId:accountId,
      topic:'TEST POST',
      usage:'Personal',
      purpose:'To Test Posting Functionality',
      briefDesc:'N/A',
      detailedDesc:'N/A',
      links:null
    }
    // CREATE NEW POST
    const id = await createPost(postContents)
    // GET POST CONTENTS FROM ID
    const newPost = await getPost(id)

    // ENSURE POST CONTENTS MATCH WHAT WAS INSERTED INTO THE DB
    newPost.id.should.equal(id)
    newPost.account_id.should.equal(postContents.accountId)
    newPost.topic.should.equal(postContents.topic)
    newPost.usage.should.equal(postContents.usage)
    newPost.purpose.should.equal(postContents.purpose)
    newPost.brief_description.should.equal(postContents.briefDesc)
    newPost.detailed_description.should.equal(postContents.detailedDesc)
    should.not.exist(newPost.links)

    // CREATE A BATCH OF NEW POSTS
    let i;
    const batches = 3
    const batchSize = 10
    for (i = 0; i < batches * batchSize; i++) {
      const id = await createPost(postContents)
    }

    // GET BATCHES OF N POSTS
    for (i = 1; i < 3; i++) {
      const postBatch = await getPosts(i, batchSize)
      postBatch.length.should.equal(batchSize)
      postBatch[0].row.should.equal(1+batchSize*(i-1))
    }

  })
})

describe('Messages DB Tests', function() {
  it(`Should...
      1. Create a Message Thread in DB`, async function() {

    // CREATE MESSAGE THREAD
    const threadId = await createMessageThread()

    
    const messageContent = {

    }
    // CREATE NEW ACCOUNT IN DB
    const id = await createAccount(accountDetails)
    // GET NEW ACCOUNT ID FROM USERNAME
    const accountId = await getAccountId(accountDetails.username)
    // ENSURE IDS MATCH
    accountId.should.equal(id)

    // GET ACCOUNT INFO FROM ID
    const account = await getAccountInfo(id)
    // ENSURE ACCOUNT INFORMATION MATCHES WHAT WAS INSERTED INTO THE DB
    account.id.should.equal(id)
    account.username.should.equal(accountDetails.username)
    account.name.should.equal(accountDetails.name)
    account.email.should.equal(accountDetails.email)
    account.phone.should.equal(accountDetails.phone)
    should.not.exist(account.linkedin)
    should.not.exist(account.github)
    should.not.exist(account.ssrn)
    account.org.should.equal(accountDetails.org)
    account.title.should.equal(accountDetails.title)
  })
})

module.exports = {
  createAccount,
  getAccountInfo,
  createMessageThread,
  createMessage,
  getMessages,
}
