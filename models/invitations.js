const { mainPgPool } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function createInvitiation(info) {
  try{
    const { accountId, email } = info
    query = `INSERT INTO invitations
                (account_id, email)
              VALUES
                (${accountId}, '${email}')
              RETURNING id`
    const result = await mainPgPool.submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    return null
  }
}

async function getInvitation(id) {
  return mainPgPool.pool
          .query(`SELECT * FROM invitations WHERE id = ${id}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

module.exports = {
  createInvitiation,
  getInvitation,
}
