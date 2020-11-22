const { mainPgPool } = require('../dbs/pg_helpers')

function getAccountInfo(accountId) {
  return mainPgPool.submit(`SELECT * FROM accounts WHERE id = $1`, [accountId])
}
