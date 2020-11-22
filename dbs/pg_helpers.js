const { Pool } = require('pg')

const mainDB = {
  user: 'mcinali',
  host: 'localhost',
  database: 'data_genie',
  password: null,
  port: 5432,
}

const authDB = {
  user: 'mcinali',
  host: 'localhost',
  database: 'data_genie_auth',
  password: null,
  port: 5432,
}

class PostgresPool {
  constructor(db) {
    this.pool = new Pool(db)
  }

  // async submit(text, values = []) {
  //   return this.pool
  //           .query(text, values)
  //           .then(res => console.log(res.rows[0]))
  //           .catch(err => console.error(err.stack))
  // }

  async submitTransaction(text, values = []) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(text, values)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      console.error(err.stack)
    } finally {
      client.release()
    }
  }
}

const authPgPool = new PostgresPool(authDB)
const mainPgPool = new PostgresPool(mainDB)

module.exports = {
  authPgPool,
  mainPgPool,
}
