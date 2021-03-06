const { Pool } = require('pg')
const { db } = require('../config')

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
