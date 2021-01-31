const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function getPassword(username, password){
  const query = `SELECT encode(password, 'escape') as password FROM accounts WHERE username = '${username}'`
  return pool
          .query(query)
          .then(res => res.rows[0].password)
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

async function storeAccessToken(info) {
  try{
    const { accountId,  token, expiration} = info
    const query = `INSERT INTO access_tokens (account_id, token, expiration)
                  VALUES (${accountId},'${token}','${expiration}') RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    throw new Error(err)
  }
}

async function getAccessTokenAccountInfo(token) {
  const query = `SELECT id, username FROM accounts
                WHERE id in (SELECT account_id FROM access_tokens
                            WHERE encode(token,'escape') = '${token}' and expiration >= now())`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

module.exports = {
  getPassword,
  storeAccessToken,
  getAccessTokenAccountInfo,
}
