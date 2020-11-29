const { submitTransaction } = require('./pg_helpers');

// CREATE TABLES in main DB

async function runDatabaseMigrations() {
  await submitTransaction(`ALTER DATABASE data_genie SET timezone TO 'GMT'`)

  await submitTransaction(`CREATE TABLE IF NOT EXISTS logins (
                            id SERIAL PRIMARY KEY NOT NULL,
                            username VARCHAR(32) UNIQUE NOT NULL,
                            password BYTEA NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

   await submitTransaction(`CREATE TABLE IF NOT EXISTS access_tokens (
                            id SERIAL PRIMARY KEY NOT NULL,
                            login_id INT NOT NULL REFERENCES logins(id),
                            token BYTEA NOT NULL,
                            expiration TIMESTAMP NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS accounts (
                            id SERIAL PRIMARY KEY NOT NULL,
                            username VARCHAR(32) UNIQUE NOT NULL,
                            name VARCHAR(64),
                            email VARCHAR(128) UNIQUE NOT NULL,
                            phone BIGINT UNIQUE NOT NULL,
                            linkedin TEXT,
                            github TEXT,
                            ssrn TEXT,
                            org VARCHAR(64) NOT NULL,
                            title VARCHAR(64) NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`DO $$
                          BEGIN
                            IF NOT EXISTS (select * from pg_type where typname = 'usage_enum') THEN CREATE TYPE usage_enum AS ENUM ('Personal','Academic','Business');
                          END IF;
                          END;
                          $$
                          LANGUAGE plpgsql;

                          CREATE TABLE IF NOT EXISTS posts (
                            id SERIAL PRIMARY KEY NOT NULL,
                            account_id INTEGER NOT NULL REFERENCES accounts(id),
                            topic VARCHAR(128) NOT NULL,
                            usage usage_enum NOT NULL,
                            purpose VARCHAR(128) NOT NULL,
                            brief_description VARCHAR(128) NOT NULL,
                            detailed_description TEXT NOT NULL,
                            links TEXT,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS message_threads (
                            id SERIAL NOT NULL PRIMARY KEY,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS message_thread_users (
                            id SERIAL NOT NULL PRIMARY KEY,
                            thread_id INTEGER NOT NULL REFERENCES message_threads(id),
                            account_id INTEGER NOT NULL REFERENCES accounts(id),
                            created_at TIMESTAMP NOT NULL DEFAULT now(),
                            CONSTRAINT unique_thread_id_account_id UNIQUE (thread_id, account_id)
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS messages (
                            id SERIAL NOT NULL PRIMARY KEY,
                            thread_id INTEGER NOT NULL REFERENCES message_threads(id),
                            account_id INTEGER NOT NULL REFERENCES accounts(id),
                            message TEXT NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS feedback (
                            id SERIAL NOT NULL PRIMARY KEY,
                            account_id INTEGER REFERENCES accounts(id),
                            message TEXT NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )

  await submitTransaction(`CREATE TABLE IF NOT EXISTS invitations (
                            id SERIAL NOT NULL PRIMARY KEY,
                            account_id INTEGER REFERENCES accounts(id),
                            email VARCHAR(128) NOT NULL,
                            created_at TIMESTAMP NOT NULL DEFAULT now()
                          )`
                        )
}

module.exports = {
  runDatabaseMigrations,
}
