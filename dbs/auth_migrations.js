const { authPgPool } = require('./pg_helpers');

// CREATE TABLES in auth DB

function authDBMigrations() {
  authPgPool.submitTransaction(`CREATE TABLE IF NOT EXISTS passwords (
                                  id SERIAL PRIMARY KEY NOT NULL,
                                  account_id INT UNIQUE NOT NULL,
                                  password BYTEA NOT NULL,
                                  created_at TIMESTAMP NOT NULL DEFAULT now()
                                )`
                              )

  authPgPool.submitTransaction(`CREATE TABLE IF NOT EXISTS access_tokens (
                                  id SERIAL PRIMARY KEY NOT NULL,
                                  password_id INT NOT NULL REFERENCES passwords(id),
                                  token BYTEA NOT NULL,
                                  expiration TIMESTAMP NOT NULL,
                                  created_at TIMESTAMP NOT NULL DEFAULT now()
                                )`
                              )
}

module.exports = {
  authDBMigrations,
}
