const { storeMessageThread,
        storeMessageThreadInfo,
        getMessageThreadId,
        getThreads,
        getThreadInfo,
        getAccounts,
        storeMessage,
        getMessagesInThread,
        updateReadMessages,
        getUnreadMessagesInThread,
        getLastNMessagesInThread,
      } = require('../models/messages')
const { getPost } = require('../models/posts')
const { getAccountInfo } = require('../models/accounts')
const {sendEmail} = require('../models/emails.js')

// Create message thread
async function createMessageThread(info) {
  try {
    const { accountId, postId } = info
    // TO DO: Check if message thread already exists for account + post
    const thread = await getMessageThreadId(accountId, postId)
    if (Boolean(thread)){
      return {
        threadId: thread.thread_id
      }
    }
    // Create message thread
    const threadId = await storeMessageThread()
    // Store message thread info
    const postDetails = await getPost(postId)
    // Store message thread info for post creator
    const messageThreadInfoCreator = {
      threadId: threadId,
      postId: postId,
      accountId: postDetails.account_id,
    }
    storeMessageThreadInfo(messageThreadInfoCreator)
    // Store message thread info for post responder
    const messageThreadInfoResponder = {
      threadId: threadId,
      postId: postId,
      accountId: accountId,
    }
    storeMessageThreadInfo(messageThreadInfoResponder)
    return {
      threadId: threadId
    }
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

// Get all message threads for account
async function getMessageThreads(accountId) {
  try {
    const threads = await getThreads(accountId)
    const threadInfo = await Promise.all(threads.map(thread => getThreadInfo(thread.thread_id)))
    const threadInfoFull = await Promise.all(threadInfo.flat().map(async (info) => {
      if (info.account_id!=accountId){
        const accountInfo = await getAccountInfo(info.account_id)
        const postInfo = await getPost(info.post_id)
        const unreadMessages = await getUnreadMessagesInThread(info.thread_id)
        const unreadMessagesCount = unreadMessages.length
        const lastMessages = await getLastNMessagesInThread(info.thread_id, 1)
        const lastMessage = lastMessages[0]
        console.log('Account Info: ', accountInfo)
        console.log('Post Info: ', postInfo)
        console.log('Unread Messages: ', unreadMessages)
        console.log('Unread Messages Count: ', unreadMessagesCount)
        console.log('lastMessage: ', lastMessage)
        return {
          thread_id: info.thread_id,
          unread_messages: unreadMessagesCount,
          last_message: {
            last_message: lastMessage.message,
            sender_account_id: lastMessage.account_id,
            created_at: lastMessage.created_at,
          },
          post: {
            id: info.post_id,
            brief_description: postInfo.brief_description,
          },
          account: {
            id: accountInfo.id,
            username: accountInfo.username,
          },
        }
      }
    }))
    const returnInfo = threadInfoFull.filter(x => x)
    return returnInfo
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
  createMessageThread,
  getMessageThreads,
  sendMessage,
  getMessages,
}
