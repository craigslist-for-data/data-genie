const { mainPgPool } = require('../dbs/pg_helpers')

async function createMessageThread() {
  try {
    query = `INSERT INTO message_threads DEFAULT VALUES RETURNING id`
    const result = await mainPgPool.submitTransaction(query)
    return result.rows[0].id
  } catch(error) {
    console.error(error.stack)
    return null
  }
}

async function createMessage(messageContents) {
  try {
    const { threadId, accountId, message } = messageContents
    query = `INSERT INTO messages
              (thread_id, account_id, message)
            VALUES
              (${threadId},
              ${accountId},
              '${message}')
            RETURNING id`
    const result = await mainPgPool.submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    return null
  }
}

async function getMessagesInThread(threadId) {
  return mainPgPool.pool
          .query(`SELECT * FROM messages WHERE thread_id = ${threadId}`)
          .then(res => res.rows)
          .catch(err => console.error(err.stack))
}

module.exports = {
  createMessageThread,
  createMessage,
  getMessagesInThread,
}
