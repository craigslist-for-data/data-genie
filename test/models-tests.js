const should = require('chai').should()
const expect = require('chai').expect
const { createAccount,  getAccountInfo, getAccountId } = require('../models/accounts')
const { createMessageThread, createMessage,  getMessagesInThread } = require('../models/messages')
const { createPost, getPost, getPostsBatch } = require('../models/posts')
const { generateFeedback, getFeedback } = require('../models/feedback')
const { createInvitiation, getInvitation } = require('../models/invitations')
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
      - Create new Account for testing
      - Fetch the Account id using username
      - Match DB Account info with account test info`, async function() {

    // Create new Account for testing
    const accountDetails = {
      username:'testAccount',
      name:'Test Account',
      email:'account@test.com',
      phone:2123456780,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const id = await createAccount(accountDetails)

    // Fetch the Account id using username
    const accountId = await getAccountId(accountDetails.username)
    // ENSURE IDS MATCH
    expect(accountId).to.equal(id)

    // Match DB Account info with account test info
    const account = await getAccountInfo(id)
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
      - Create new Account for testing
      - Create a new Post in DB
      - Get Post using id
      - Return correct Post content
      - Create Batches of Posts
      - Return Batches of Posts`, async function() {

    // Create new Account for testing
    const accountDetails = {
      username:'testPost',
      name:'Test Post',
      email:'post@test.com',
      phone:2123456781,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId = await createAccount(accountDetails)

    // Create a new Post in DB
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

    // Get Post using id
    const newPost = await getPost(id)
    // Return correct Post content
    expect(newPost.id).to.equal(id)
    expect(newPost.account_id).to.equal(postContents.accountId)
    expect(newPost.topic).to.equal(postContents.topic)
    expect(newPost.usage).to.equal(postContents.usage)
    expect(newPost.purpose).to.equal(postContents.purpose)
    expect(newPost.brief_description).to.equal(postContents.briefDesc)
    expect(newPost.detailed_description).to.equal(postContents.detailedDesc)
    should.not.exist(newPost.links)

    // Create Batches of Posts
    let i;
    const batches = 3
    const batchSize = 10
    for (i = 0; i < batches * batchSize; i++) {
      const id = await createPost(postContents)
    }
    // Return Batches of Posts
    for (i = 1; i < 3; i++) {
      const postBatch = await getPostsBatch(i, batchSize)
      expect(postBatch.length).to.equal(batchSize)
      expect(postBatch[0].row).to.equal(1+batchSize*(i-1))
    }

  })
})

// TEST MESSAGE MODELS
describe('Messages DB Tests', function() {
  it(`Should...
      - Create & Check Message Threads in the DB
      - Create new Account for testing
      - Create a Message in the DB
      - Check Message was inserted correctly into DB
      - Insert additional message and ensure it was added to the thread`, async function() {

    // Create & Check Message Threads in the DB
    const threadId1 = await createMessageThread()
    const maxThreadId = await mainPgPool.pool
                                .query(`SELECT max(id) FROM message_threads`)
                                .then(res => res.rows[0].max)
                                .catch(err => console.error(err.stack))
    const threadId2 = await createMessageThread()
    expect(threadId1).to.equal(maxThreadId)
    expect(threadId2).to.be.above(maxThreadId)

    // Create new Account for testing
    const accountDetails = {
      username:'testMessage',
      name:'Test Message',
      email:'message@test.com',
      phone:2123456782,
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId = await createAccount(accountDetails)

    // Create a Message in the DB
    const messageContent1 = {
      threadId:threadId1,
      accountId:accountId,
      message:"Hey! Test Message",
    }
    const initialMessageId = await createMessage(messageContent1)

    // Check Message was inserted correctly into DB
    const initialMessageThread = await getMessagesInThread(threadId1)
    const message = initialMessageThread[0]
    expect(message.id).to.equal(initialMessageId)
    expect(message.thread_id).to.equal(messageContent1.threadId)
    expect(message.account_id).to.equal(messageContent1.accountId)
    expect(message.message).to.equal(messageContent1.message)
    expect(initialMessageThread.length).to.equal(1)

    // Insert additional message and ensure it was added to the thread
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

// TEST FEEDBACK MODELS
describe('Feedback DB Tests', function() {
  it(`Should...
      - Create Feedback with no Account
      - Verify correct info for Feedback with no Account
      - Create new Account for testing
      - Create Feedback with Account
      - Verify correct info for Feedback with Account`, async function() {

        // Create Feedback with no Account
        const feedbackNoAccountContent = {
          accountId:null,
          message:"This app is really great, I'm so eager to sign up",
        }

        // Verify correct info for Feedback with no Account
        const feedbackNoAccountId = await generateFeedback(feedbackNoAccountContent)
        const feedbackNoAccount = await getFeedback(feedbackNoAccountId)
        expect(feedbackNoAccount.id).to.equal(feedbackNoAccountId)
        expect(feedbackNoAccount.message).to.equal(feedbackNoAccountContent.message)
        should.not.exist(feedbackNoAccount.account_id)

        // Create new Account for testing
        const accountDetails = {
          username:'testFeedback',
          name:'Test Feedback',
          email:'feedback@test.com',
          phone:2123456783,
          linkedin:null,
          github:null,
          ssrn:null,
          org:'TEST',
          title:'TEST',
        }
        const accountId = await createAccount(accountDetails)

        // Create Feedback with Account
        const feedbackWithAccountContent = {
          accountId:accountId,
          message:`I'm a poweruser!`,
        }

        // Verify correct info for Feedback with Account
        const feedbackWithAccountId = await generateFeedback(feedbackWithAccountContent)
        const feedbackWithAccount = await getFeedback(feedbackWithAccountId)
        expect(feedbackWithAccount.id).to.equal(feedbackWithAccountId)
        expect(feedbackWithAccount.message).to.equal(feedbackWithAccountContent.message)
        expect(feedbackWithAccount.account_id).to.equal(accountId)
  })
})

// TEST INVITATIONS MODELS
describe('Invitiations DB Tests', function() {
  it(`Should...
      - Create Invitation without Account
      - Verify correct info for Invitation without Account
      - Create New Account for Testing
      - Create Invitation with Account
      - Verify correct info for Invitation with Account`, async function() {

        // Create Feedback with no Account
        const invitationNoAccountContent = {
          accountId:null,
          email:"test@test.com",
        }
        const invtiationNoAccountId = await createInvitiation(invitationNoAccountContent)
        // Verify correct info for Invitation without Account
        const invitationNoAccount = await getInvitation(invtiationNoAccountId)
        expect(invitationNoAccount.id).to.equal(invtiationNoAccountId)
        should.not.exist(invitationNoAccount.account_id)
        expect(invitationNoAccount.email).to.equal(invitationNoAccountContent.email)

        // Create new Account for testing
        const accountDetails = {
          username:'testInvitation',
          name:'Test Invitation',
          email:'invitation@test.com',
          phone:2123456784,
          linkedin:null,
          github:null,
          ssrn:null,
          org:'TEST',
          title:'TEST',
        }
        const accountId = await createAccount(accountDetails)

        // Create Invitation with Account
        const invitationWithAccountContent = {
          accountId:accountId,
          email:"test@test.com",
        }
        const invtiationWithAccountId = await createInvitiation(invitationWithAccountContent)

        // Verify correct info for Invitation with Account
        const invitationWithAccount = await getInvitation(invtiationWithAccountId)
        expect(invitationWithAccount.id).to.equal(invtiationWithAccountId)
        expect(invitationWithAccount.account_id).to.equal(invitationWithAccountContent.accountId)
        expect(invitationWithAccount.email).to.equal(invitationWithAccountContent.email)
  })
})
