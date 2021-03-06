const env = process.env.NODE_ENV
const fs = require('fs')
const { GCP_POSTGRES_PASSWORD } = require('./secrets')

// Local DB configuration
const localDB = {
  host: 'localhost',
  user: 'mcinali',
  password: null,
  database: 'data_genie',
  port: 5432,
}
// GCP DB configuration
const gcpDB = {
  user: 'backend',
  password: GCP_POSTGRES_PASSWORD,
  database: 'data-genie',
  host: 'localhost',
  port: 5432,
}
// Set db variable
const db = (env=='prod') ? gcpDB : localDB

module.exports = {
  db,
}
