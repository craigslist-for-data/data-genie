const should = require('chai').should()
const expect = require('chai').expect
const { createAccount,  getAccountInfo, getAccountId } = require('../models/accounts')
const { createMessageThread, createMessage,  getMessagesInThread } = require('../models/messages')
const { createPost, getPost, getPostsBatch } = require('../models/posts')
const { mainPgPool } = require('../dbs/pg_helpers')

// CLEAR ALL TEST DATA BEFORE PROCEEDING
describe('Clear DB Data', function() {
  it('Should clear test data', async function() {
    await mainPgPool.submitTransaction('DELETE FROM feedback')
    await mainPgPool.submitTransaction('DELETE FROM invitations')
    await mainPgPool.submitTransaction('DELETE FROM messages')
    await mainPgPool.submitTransaction('DELETE FROM message_threads')
    await mainPgPool.submitTransaction('DELETE FROM posts')
    await mainPgPool.submitTransaction('DELETE FROM accounts')
  })
})

// TEST ACCOUNT MODELS
describe('Accounts Models Tests', function() {
  it(`Should...
      1. Create an Account in DB
      2. Fetch the Account id using username
      3. Match DB Account info with account test info`, async function() {

    // CREATE NEW ACCOUNT IN DB
    const accountDetails = {
      username:'test1',
      name:'Test User1',
      email:'test1@gmail.com',
      phone:2123456780,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const id = await createAccount(accountDetails)

    // GET NEW ACCOUNT ID FROM USERNAME
    const accountId = await getAccountId(accountDetails.username)
    // ENSURE IDS MATCH
    expect(accountId).to.equal(id)

    // GET ACCOUNT INFO FROM ID
    const account = await getAccountInfo(id)
    // ENSURE ACCOUNT INFORMATION MATCHES WHAT WAS INSERTED INTO THE DB
    expect(account.id).to.equal(id)
    expect(account.username).to.equal(accountDetails.username)
    expect(account.name).to.equal(accountDetails.name)
    expect(account.email).to.equal(accountDetails.email)
    expect(account.phone).to.equal(accountDetails.phone)
    should.not.exist(account.linkedin)
    should.not.exist(account.github)
    should.not.exist(account.ssrn)
    expect(account.org).to.equal(accountDetails.org)
    expect(account.title).to.equal(accountDetails.title)
  })
})

// TEST POST MODELS
describe('Posts Models Tests', function() {
  it(`Should...
      1. Create a new Post in DB
      2. Get Post using id
      3. Return correct Post content
      4. Return batches of Posts`, async function() {

    // CREATE NEW ACCOUNT IN DB
    const accountDetails = {
      username:'test2',
      name:'Test User2',
      email:'test2@gmail.com',
      phone:2123456781,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId = await createAccount(accountDetails)

    // CREATE NEW POST IN DB
    const postContents = {
      accountId:accountId,
      topic:'TEST POST',
      usage:'Personal',
      purpose:'To Test Posting Functionality',
      briefDesc:'N/A',
      detailedDesc:'N/A',
      links:null,
    }
    const id = await createPost(postContents)

    // GET POST CONTENTS FROM ID
    const newPost = await getPost(id)
    // ENSURE POST CONTENTS MATCH WHAT WAS INSERTED INTO THE DB
    expect(newPost.id).to.equal(id)
    expect(newPost.account_id).to.equal(postContents.accountId)
    expect(newPost.topic).to.equal(postContents.topic)
    expect(newPost.usage).to.equal(postContents.usage)
    expect(newPost.purpose).to.equal(postContents.purpose)
    expect(newPost.brief_description).to.equal(postContents.briefDesc)
    expect(newPost.detailed_description).to.equal(postContents.detailedDesc)
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
      const postBatch = await getPostsBatch(i, batchSize)
      expect(postBatch.length).to.equal(batchSize)
      expect(postBatch[0].row).to.equal(1+batchSize*(i-1))
    }

  })
})

describe('Messages DB Tests', function() {
  it(`Should...
      1. Create Message Threads in the DB
      2. Create a Message in the DB`, async function() {

    // CREATE MESSAGE THREADS + ENSURE THREADS ARE INCREMENTING
    const threadId1 = await createMessageThread()
    const maxThreadId = await mainPgPool.pool
                                .query(`SELECT max(id) FROM message_threads`)
                                .then(res => res.rows[0].max)
                                .catch(err => console.error(err.stack))
    const threadId2 = await createMessageThread()
    expect(threadId1).to.equal(maxThreadId)
    expect(threadId2).to.be.above(maxThreadId)

    // CREATE NEW ACCOUNT IN DB
    const accountDetails = {
      username:'test3',
      name:'Test User3',
      email:'test3@gmail.com',
      phone:2123456782,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId = await createAccount(accountDetails)

    // CREATE NEW MESSAGES
    const messageContent1 = {
      threadId:threadId1,
      accountId:accountId,
      message:"Hey! Test Message",
    }
    const initialMessageId = await createMessage(messageContent1)

    const initialMessageThread = await getMessagesInThread(threadId1)
    const message = initialMessageThread[0]
    expect(message.id).to.equal(initialMessageId)
    expect(message.thread_id).to.equal(messageContent1.threadId)
    expect(message.account_id).to.equal(messageContent1.accountId)
    expect(message.message).to.equal(messageContent1.message)
    expect(initialMessageThread.length).to.equal(1)

    const messageContent2 = {
      threadId:threadId1,
      accountId:accountId,
      message:"No Reply :(",
    }
    const replyMessageId = await createMessage(messageContent2)
    const messageThread = await getMessagesInThread(threadId1)
    expect(messageThread.length).to.equal(2)


  })
})
