const { mainPgPool } = require('../dbs/pg_helpers')
const { stringify } = require('../utilities')

async function createAccount(accountDetails) {
  const { username, name, email, phone, linkedin, github, ssrn, org, title } = accountDetails
  query = `INSERT INTO accounts
              (username, name, email, phone, linkedin, github, ssrn, org, title)
            VALUES
              ('${username}',
              '${name}',
              '${email}',
              ${phone},
              ${stringify(linkedin)},
              ${stringify(github)},
              ${stringify(ssrn)},
              ${stringify(org)},
              ${stringify(title)})
            RETURNING id`
  console.log(query)
  return mainPgPool.submitTransaction(query)
}

async function getAccountInfo(accountId) {
  return mainPgPool.pool
          .query(`SELECT * FROM accounts WHERE id = ${accountId}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

async function getAccountId(username) {
  return mainPgPool.pool
          .query(`SELECT id FROM accounts WHERE username = ${username}`)
          .then(res => res.rows[0])
          .catch(err => console.error(err.stack))
}

module.exports = {
  createAccount,
  getAccountInfo,
  getAccountId,
}
