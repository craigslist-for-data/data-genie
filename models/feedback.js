const { mainPgPool } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function generateFeedback(feedback) {
  try{
    const { accountId, message } = feedback
    query = `INSERT INTO feedback
                (account_id, message)
              VALUES
                (${accountId}, ${stringifyForPGInsert(message)})
              RETURNING id`
    const result = await mainPgPool.submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    return null
  }
}

async function getFeedback(feedbackId) {
  return mainPgPool.pool
          .query(`SELECT * FROM feedback WHERE id = ${feedbackId}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

module.exports = {
  generateFeedback,
  getFeedback,
}
