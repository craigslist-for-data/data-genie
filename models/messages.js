const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeMessageThread() {
  try {
    const query = `INSERT INTO message_threads DEFAULT VALUES RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch(err) {
    console.error(err)
    throw new Error(err)
  }
}

async function storeMessageThreadInfo(messageThreadInfo) {
  try {
    const { threadId, postId, accountId } = messageThreadInfo
    const query = `INSERT INTO message_thread_info (thread_id, post_id, account_id) VALUES (${threadId},${postId},${accountId}) RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch(err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getMessageThreadId(accountId, postId) {
  const query = `SELECT thread_id FROM message_thread_info WHERE account_id = ${accountId} AND post_id = ${postId}`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

async function getAccounts(threadId) {
  const query = `SELECT account_id FROM message_thread_info WHERE thread_id = ${threadId}`
  return pool
          .query(query)
          .then(res => res.rows)
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

async function getThreads(accountId) {
  const query = `SELECT thread_id FROM message_thread_info WHERE account_id = ${accountId}`
  return pool
          .query(query)
          .then(res => res.rows)
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

async function storeMessage(messageContents) {
  try {
    const { threadId, accountId, message } = messageContents
    const query = `INSERT INTO messages
                    (thread_id, account_id, message)
                  VALUES
                    (${threadId},
                    ${accountId},
                    ${stringifyForPGInsert(message)})
                  RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getMessagesInThread(threadId) {
  const query = `SELECT * FROM messages WHERE thread_id = ${threadId} ORDER BY created_at asc`
  return pool
          .query(query)
          .then(res => res.rows)
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

module.exports = {
  storeMessageThread,
  storeMessageThreadInfo,
  getMessageThreadId,
  getAccounts,
  getThreads,
  storeMessage,
  getMessagesInThread,
}
