const { pool, submitTransaction } = require('../dbs/pg_helpers')
const { stringifyForPGInsert } = require('../utilities')

async function storeAccount(accountDetails) {
  try{
    const { username, password, name, email, phone, linkedin, github, ssrn, org, title } = accountDetails
    const query = `INSERT INTO accounts
                    (username, password, name, email, phone, linkedin, github, ssrn, org, title)
                  VALUES
                    ('${username}',
                    '${password}',
                    '${name}',
                    '${email}',
                    ${stringifyForPGInsert(phone)},
                    ${stringifyForPGInsert(linkedin)},
                    ${stringifyForPGInsert(github)},
                    ${stringifyForPGInsert(ssrn)},
                    ${stringifyForPGInsert(org)},
                    ${stringifyForPGInsert(title)})
                  RETURNING id`
    const result = await submitTransaction(query)
    return result.rows[0].id
  } catch (err) {
    console.error(err)
    throw new Error(err)
  }
}

async function getAccountInfo(accountId) {
  const query = `SELECT * FROM accounts WHERE id = ${accountId}`
  return pool
          .query(query)
          .then(res => res.rows[0])
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

async function getAccountId(username) {
  const query = `SELECT id FROM accounts WHERE username = '${username}'`
  return pool
          .query(query)
          .then(res => res.rows[0].id)
          .catch(err => {
            console.error(err)
            throw new Error(err)
          })
}

module.exports = {
  storeAccount,
  getAccountInfo,
  getAccountId,
}
