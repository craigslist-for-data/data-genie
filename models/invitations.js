const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeInvitation(info) {
  try{
    const { accountId, email } = info
    const query = `INSERT INTO invitations
                    (account_id, email)
                  VALUES
                    (${stringifyForPGInsert(accountId)}, ${stringifyForPGInsert(email)})
                  RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getInvitation(id) {
  const query = `SELECT * FROM invitations WHERE id = ${id}`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

module.exports = {
  storeInvitation,
  getInvitation,
}
