const { storeMessageThread, storeMessage, getMessagesInThread } = require('../models/messages')

// Send message
async function sendMessage(threadId, info) {
  try {
    // Check if thread exists
    

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
  sendMessage,
  getMessages,
}
