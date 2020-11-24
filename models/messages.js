const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeMessageThread() {
  try {
    query = `INSERT INTO message_threads DEFAULT VALUES RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch(error) {
    console.error(error.stack)
    return null
  }
}

async function storeMessage(messageContents) {
  try {
    const { threadId, accountId, message } = messageContents
    query = `INSERT INTO messages
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
    return null
  }
}

async function getMessagesInThread(threadId) {
  return pool
          .query(`SELECT * FROM messages WHERE thread_id = ${threadId}`)
          .then(res => res.rows)
          .catch(err => console.error(err.stack))
}

module.exports = {
  storeMessageThread,
  storeMessage,
  getMessagesInThread,
}
