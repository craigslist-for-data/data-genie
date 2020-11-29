const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeLoginCredentials(credentials) {
  try{
    const { username, password } = credentials
    const query = `INSERT INTO logins (username, password)
                  VALUES ('${username}','${password}') RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    throw new Error(err)
  }
}

async function getPassword(username) {
  const query = `SELECT encode(password,'escape') as password FROM logins WHERE username = '${username}'`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

async function getLoginId(username) {
  const query = `SELECT id from logins where username = '${username}'`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

async function storeAccessToken(info) {
  try{
    const { loginId,  token, expiration} = info
    const query = `INSERT INTO access_tokens (login_id, token, expiration)
                  VALUES ('${loginId}','${token}','${expiration}') RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err.stack)
    throw new Error(err)
  }
}

async function verifyAccessToken(info) {
  const { loginId, token } = info
  const query = `SELECT true as verified
                FROM access_tokens
                WHERE encode(token,'escape') = '${token}' and login_id = ${loginId} and expiration >= now()`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
}

module.exports = {
  storeLoginCredentials,
  getPassword,
  getLoginId,
  storeAccessToken,
  verifyAccessToken,
}
