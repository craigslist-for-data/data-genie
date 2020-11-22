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

describe('Accounts DB', function() {
  it('Should create Account + fetch the account id from username + match DB account info with account test info', async function() {
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
  it('Should create a new Post + get Post by id + return correct content + return batches of posts', async function() {
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

    // TO DO: ADD TEST FOR GRABBING BATCHES OF POSTS

  })
})


module.exports = {
  createAccount,
  getAccountInfo,
  createMessageThread,
  createMessage,
  getMessages,
}
