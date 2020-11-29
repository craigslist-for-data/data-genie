const { storeMessageThread, storeMessageThreadUser, getThreads, getAccounts, storeMessage, getMessagesInThread } = require('../models/messages')
const {sendEmail} = require('./models/emails.js')

// Create message thread
async function createThread(users) {
  try {
    // Check if threadId exists
    const threadId = await storeMessageThread()
    const threadUsers =  users.map(function(x) {return storeMessageThreadUser(threadId, x.accountId)})
    return {"threadId":threadId,
            "users":threadUsers}
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get all message threads for account
async function getMessageThreads(accountId) {
  try {
    const threads = getThreads(accountId)
    return threads
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Send Message
async function sendMessage(message){
  try {
    const messageId = storeMessage(message)
    const accounts = getAccounts(message.threadId)
    // TO DO: Send email with message to all accounts
    const msgs = accounts.map(x => {
                                      to: x.email,
                                      from: 'craigslistfordata@gmail.com',
                                      subject: `New Data Genie Message!`,
                                      text: message.message,
                                      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                                    }
    msgs.map(x => sendEmail(x))
    return messageId
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get messages in thread
async function getMessages(threadId){
  try {
    const messages = getMessagesInThread(threadId)
    return messages
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

module.exports = {
  createThread,
  getMessageThreads,
  sendMessage,
  getMessages,
}
