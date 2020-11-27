const { storeMessageThread, storeMessageThreadUser, getThreads, getThreadAccounts, storeMessage, getMessagesInThread } = require('../models/messages')

// Create message thread
async function createThread(users) {
  try {
    // Check if threadId exists
    const threadId = storeMessageThread()
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
async function sendMessage(threadId, message){
  try {
    const messageId = storeMessage(message)
    const accounts = getThreadAccounts(threadId)
    // TO DO: Send email with message to all accounts
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
