const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeMessageThread() {
  try {
    query = `INSERT INTO message_threads DEFAULT VALUES RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch(error) {
    console.error(error.stack)
    throw new Error(err)
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
    throw new Error(err)
  }
}

async function getMessagesInThread(threadId) {
  return pool
          .query(`SELECT * FROM messages WHERE thread_id = ${threadId}`)
          .then(res => res.rows)
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

module.exports = {
  storeMessageThread,
  storeMessage,
  getMessagesInThread,
}
