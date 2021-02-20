const { storeMessageThread,
        storeMessageThreadUser,
        getThreads,
        getAccounts,
        storeMessage,
        getMessagesInThread
      } = require('../models/messages')
const { getAccountInfo } = require('../models/accounts')
const {sendEmail} = require('../models/emails.js')

// Create message thread
async function createThread(users) {
  try {
    // Check if threadId exists
    const threadId = await storeMessageThread()
    const threadUsers =  await Promise.all(users.map(function(x) {return storeMessageThreadUser(threadId, x.accountId)}))
    return {
      threadId: threadId,
      users: threadUsers
    }
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
    const threadAccounts = await getAccounts(message.threadId)
    const sendAccounts = threadAccounts.filter(x => x.account_id !== message.accountId)
    const accountsDetails = await Promise.all(sendAccounts.map(x => getAccountInfo(x.account_id)))
    // TO DO: Send email with message to all accounts
    const msgs = accountsDetails.map(x => msg = {
                                      to: x.email,
                                      from: 'craigslistfordata@gmail.com',
                                      subject: `New Data Genie Message!`,
                                      text: message.message,
                                      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                                    })
    console.log(msgs)
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
