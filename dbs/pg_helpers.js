const { Pool } = require('pg')
const DB_HOST = process.env.DB_HOST
const USER = process.env.USER
console.log('Database Host: ',DB_HOST)
console.log('User: ',USER)

const db = {
  user: USER,
  host: DB_HOST,
  database: 'data_genie',
  password: null,
  port: 5432,
}

const pool = new Pool(db)

async function submitTransaction(text, values = []) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query(text, values)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err.stack)
  } finally {
    client.release()
  }
}

module.exports = {
  pool,
  submitTransaction,
}
