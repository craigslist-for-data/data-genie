const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeFeedback(feedback) {
  try{
    const { accountId, message } = feedback
    query = `INSERT INTO feedback
                (account_id, message)
              VALUES
                (${accountId}, ${stringifyForPGInsert(message)})
              RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    throw new Error(err)
  }
}

async function getFeedback(feedbackId) {
  return pool
          .query(`SELECT * FROM feedback WHERE id = ${feedbackId}`)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

module.exports = {
  storeFeedback,
  getFeedback,
}
