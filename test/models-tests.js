const should = require('chai').should()
const expect = require('chai').expect
const { storeAccount,  getAccountInfo, getAccountId } = require('../models/accounts')
const {
  storeMessageThread,
  storeMessageThreadInfo,
  getMessageThreadId,
  getAccounts,
  getThreads,
  storeMessage,
  getMessagesInThread,
} = require('../models/messages')
const { storePost, getPost, getPostsBatch } = require('../models/posts')
const { storeFeedback, getFeedback } = require('../models/feedback')
const { storeInvitation, getInvitation } = require('../models/invitations')
const { getPassword,
        storeAccessToken,
        getAccessTokenAccountInfo } = require('../models/auth')
const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { runDatabaseMigrations } = require('../dbs/main_migrations')

// RUN DB Migrations
describe('DB Migrations Tests', function() {
  it(`Should...
    - Run DB Migrations`, async function() {
      await runDatabaseMigrations()
    })
})

// CLEAR ALL TEST DATA BEFORE PROCEEDING
describe('Clear DB Data', function() {
  it('Should clear test data', async function() {
    await submitTransaction('DELETE FROM accounts')
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
      password:'testpass',
      name:'Test Account',
      email:'account@test.com',
      phone:'2123456780',
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const id = await storeAccount(accountDetails)

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
      phone:'2123456781',
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId = await storeAccount(accountDetails)

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
    const id = await storePost(postContents)

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
      const id = await storePost(postContents)
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
      - Create new Accounts for testing
      - Create a new Post in DB
      - Create & Check Message Threads in the DB
      - Create & Check Message Thread Users in the DB
      - Get & Check Message threadId by accountId & postId
      - Create a Message in the DB
      - Check Message was inserted correctly into DB
      - Insert additional message and ensure it was added to the thread`, async function() {
    // Create new Accounts for testing
    const accountDetails1 = {
      username:'testMessage1',
      password: 'testpass',
      name:'Test Message1',
      email:'message1@test.com',
      phone:'9173456781',
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountDetails2 = {
      username:'testMessage2',
      password: 'testpass',
      name:'Test Message2',
      email:'message2@test.com',
      phone:'9173456782',
      linkedin:null,
      github:null,
      ssrn:null,
      org:'TEST',
      title:'TEST',
    }
    const accountId1 = await storeAccount(accountDetails1)
    const accountId2 = await storeAccount(accountDetails2)
    // Create a new Post in DB
    const postContents = {
      accountId:accountId1,
      topic:'TEST MESSAGE',
      usage:'Personal',
      purpose:'To Test Messaging Functionality',
      briefDesc:'N/A',
      detailedDesc:'N/A',
      links:null,
    }
    const id = await storePost(postContents)
    // Create & Check Message Threads in the DB
    const threadId1 = await storeMessageThread(id)
    const maxThreadId = await pool
                                .query(`SELECT max(id) FROM message_threads`)
                                .then(res => res.rows[0].max)
                                .catch(err => console.error(err.stack))
    expect(threadId1).to.equal(maxThreadId)

    const threadId2 = await storeMessageThread(id)
    expect(threadId2).to.be.above(maxThreadId)
    // Create & Check Message Thread Users in the DB
    const messageThreadInfo1 = {
      threadId: threadId1,
      postId: id,
      accountId: accountId1,
    }
    const messageThreadInfo2 = {
      threadId: threadId1,
      postId: id,
      accountId: accountId2,
    }
    const messageThread1UserId1 = await storeMessageThreadInfo(messageThreadInfo1)
    const messageThread1UserId2 = await storeMessageThreadInfo(messageThreadInfo2)

    function getAccountElement(row) {
      return row['account_id']
    }
    const threadUserRows = await getAccounts(threadId1)
    const threadUsers = threadUserRows.map(getAccountElement)
    threadUsers.should.contain(accountId1)
    threadUsers.should.contain(accountId2)
    expect(threadUsers.length).to.equal(2)

    const account1Threads = await getThreads(accountId1)
    const account2Threads = await getThreads(accountId2)
    expect(account1Threads[0].thread_id).to.equal(threadId1)
    expect(account2Threads[0].thread_id).to.equal(threadId1)
    // Get & Check Message threadId by accountId & postId
    const existingThreadId = await getMessageThreadId(accountId1, id)
    const nonexistantThreadId1 = await getMessageThreadId(accountId1, 0)
    const nonexistantThreadId2 = await getMessageThreadId(0, id)
    expect(existingThreadId.thread_id).to.equal(threadId1)
    should.not.exist(nonexistantThreadId1)
    should.not.exist(nonexistantThreadId2)
    // Create a Message in the DB
    const messageContent1 = {
      threadId:threadId1,
      accountId:accountId1,
      message:"Hey! Test Message",
    }
    const initialMessageId = await storeMessage(messageContent1)

    // Check Message was inserted correctly into DB
    const initialMessageThread = await getMessagesInThread(threadId1)
    const initialMessage = initialMessageThread[0]
    expect(initialMessage.id).to.equal(initialMessageId)
    expect(initialMessage.thread_id).to.equal(messageContent1.threadId)
    expect(initialMessage.account_id).to.equal(messageContent1.accountId)
    expect(initialMessage.message).to.equal(messageContent1.message)
    expect(initialMessageThread.length).to.equal(1)

    // Insert additional message and ensure it was added to the thread
    const messageContent2 = {
      threadId:threadId1,
      accountId:accountId2,
      message:"Reply!",
    }
    const replyMessageId = await storeMessage(messageContent2)
    const replyMessageThread = await getMessagesInThread(threadId1)
    expect(replyMessageThread.length).to.equal(2)
    const replyMessage = replyMessageThread[1]
    expect(replyMessage.id).to.equal(replyMessageId)
    expect(replyMessage.thread_id).to.equal(messageContent2.threadId)
    expect(replyMessage.account_id).to.equal(messageContent2.accountId)
    expect(replyMessage.message).to.equal(messageContent2.message)
    expect(initialMessageThread.length).to.equal(1)
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
        const feedbackNoAccountId = await storeFeedback(feedbackNoAccountContent)
        const feedbackNoAccount = await getFeedback(feedbackNoAccountId)
        expect(feedbackNoAccount.id).to.equal(feedbackNoAccountId)
        expect(feedbackNoAccount.message).to.equal(feedbackNoAccountContent.message)
        should.not.exist(feedbackNoAccount.account_id)

        // Create new Account for testing
        const accountDetails = {
          username:'testFeedback',
          password: 'testpass',
          name:'Test Feedback',
          email:'feedback@test.com',
          phone:'2123456783',
          linkedin:null,
          github:null,
          ssrn:null,
          org:'TEST',
          title:'TEST',
        }
        const accountId = await storeAccount(accountDetails)

        // Create Feedback with Account
        const feedbackWithAccountContent = {
          accountId:accountId,
          message:`I'm a poweruser!`,
        }

        // Verify correct info for Feedback with Account
        const feedbackWithAccountId = await storeFeedback(feedbackWithAccountContent)
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
        const invtiationNoAccountId = await storeInvitation(invitationNoAccountContent)
        // Verify correct info for Invitation without Account
        const invitationNoAccount = await getInvitation(invtiationNoAccountId)
        expect(invitationNoAccount.id).to.equal(invtiationNoAccountId)
        should.not.exist(invitationNoAccount.account_id)
        expect(invitationNoAccount.email).to.equal(invitationNoAccountContent.email)

        // Create new Account for testing
        const accountDetails = {
          username:'testInvitation',
          password: 'testpass',
          name:'Test Invitation',
          email:'invitation@test.com',
          phone:'2123456784',
          linkedin:null,
          github:null,
          ssrn:null,
          org:'TEST',
          title:'TEST',
        }
        const accountId = await storeAccount(accountDetails)

        // Create Invitation with Account
        const invitationWithAccountContent = {
          accountId:accountId,
          email:"test@test.com",
        }
        const invtiationWithAccountId = await storeInvitation(invitationWithAccountContent)

        // Verify correct info for Invitation with Account
        const invitationWithAccount = await getInvitation(invtiationWithAccountId)
        expect(invitationWithAccount.id).to.equal(invtiationWithAccountId)
        expect(invitationWithAccount.account_id).to.equal(invitationWithAccountContent.accountId)
        expect(invitationWithAccount.email).to.equal(invitationWithAccountContent.email)
  })
})

describe('Auth Models Tests', function() {
  it(`Should...
      - Create Auth test account
      - Check password
      - Create new access tokens
      - Verify access token
      - Verify expired access token`, async function() {
        // Create Auth test account
        const authTestAccountDetails = {
          username:'authTestAccount',
          password:'testpass',
          name:'Auth Test',
          email:'auth@test.com',
          phone:'9991113345',
          linkedin:null,
          github:null,
          ssrn:null,
          org:'TEST',
          title:'TEST',
        }
        const id = await storeAccount(authTestAccountDetails)
        // Check password
        const password = await getPassword(authTestAccountDetails.username)
        expect(password).to.equal(authTestAccountDetails.password)
        //  Create new access tokens
        const futureTS = new Date(Date.now() + 10000).toISOString()
        const validAccessToken = {
          accountId:id,
          token:"validtesttoken",
          expiration:futureTS,
        }
        const validTokenId = await storeAccessToken(validAccessToken)

        // Verify access token
        const accessTokenLogin = await getAccessTokenAccountInfo(validAccessToken.token)
        expect(accessTokenLogin.id).to.equal(id)
        expect(accessTokenLogin.username).to.equal(authTestAccountDetails.username)

        // Verify expired access token
        const expiredTS = new Date(Date.now()).toISOString()
        const invalidAccessToken = {
          accountId:id,
          token:"invalidtesttoken",
          expiration:expiredTS,
        }
        const invalidTokenId = await storeAccessToken(invalidAccessToken)
        const invalidatedAccessToken = await getAccessTokenAccountInfo(invalidAccessToken.token)
        should.not.exist(invalidatedAccessToken)
      })
    })
