const express = require('express')
const cors = require('cors')
const index = require('./routes/index')
const accounts = require('./routes/accounts')
const feedback = require('./routes/feedback')
const posts = require('./routes/posts')
const { runDatabaseMigrations } = require('./dbs/main_migrations')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/',index)
app.use('/account',accounts)
app.use('/feedback',feedback)
app.use('/posts',posts)

const hostname = '0.0.0.0';
const port = 8080;

app.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}`)
})

// DB stuff
runDatabaseMigrations()
