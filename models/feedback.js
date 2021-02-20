const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeFeedback(feedback) {
  try{
    const { accountId, message } = feedback
    const accountIdForDB = (accountId) ? accountId : null
    const query = `INSERT INTO feedback
                    (account_id, message)
                  VALUES
                    (${accountIdForDB}, ${stringifyForPGInsert(message)})
                  RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getFeedback(feedbackId) {
  const query = `SELECT * FROM feedback WHERE id = ${feedbackId}`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

module.exports = {
  storeFeedback,
  getFeedback,
}
