const { mainPgPool } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeAccount(accountDetails) {
  try{
    const { username, name, email, phone, linkedin, github, ssrn, org, title } = accountDetails
    query = `INSERT INTO accounts
                (username, name, email, phone, linkedin, github, ssrn, org, title)
              VALUES
                ('${username}',
                '${name}',
                '${email}',
                ${phone},
                ${stringifyForPGInsert(linkedin)},
                ${stringifyForPGInsert(github)},
                ${stringifyForPGInsert(ssrn)},
                ${stringifyForPGInsert(org)},
                ${stringifyForPGInsert(title)})
              RETURNING id`
    const result = await mainPgPool.submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getAccountInfo(accountId) {
  return mainPgPool.pool
          .query(`SELECT * FROM accounts WHERE id = ${accountId}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

async function getAccountId(username) {
  return mainPgPool.pool
          .query(`SELECT id FROM accounts WHERE username = '${username}'`)
          .then(res => res.rows[0].id)
          .catch(err => console.error(err.stack))
}

module.exports = {
  storeAccount,
  getAccountInfo,
  getAccountId,
}
