const { mainPgPool } = require('../dbs/pg_helpers')

async function createMessageThread() {
  return mainPgPool.submitTransaction(`INSERT INTO message_threads (created_at) VALUES (now())`)
}

async function createMessage(messageContents) {
  const { threadId, accountId, message } = messageContents
  query = `INSERT INTO messages
            (thread_id, account_id, message)
          VALUES
            (${threadId},
            ${accountId},
            '${message}')
          RETURNING id`
  return mainPgPool.submitTransaction(query)
}

async function getMessages(threadID) {
  return mainPgPool.pool
          .query(`SELECT * FROM messages WHERE thread_id = ${threadId}`)
          .then(res => res.rows)
          .catch(err => console.error(err.stack))
}

module.exports = {
  createMessageThread,
  createMessage,
  getMessages,
}
