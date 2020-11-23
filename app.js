const express = require('express')
const cors = require('cors')
const index = require('./routes/index');
const { mainDBMigrations } = require('./dbs/main_migrations')
const { authDBMigrations } = require('./dbs/auth_migrations')

const app = express()
app.use(cors())
app.use('/index',index)

const hostname = '0.0.0.0';
const port = 8080;

app.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}`)
})

// mainDBMigrations()
// authDBMigrations()
