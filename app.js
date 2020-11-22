const http = require('http');
const { mainDBMigrations } = require('./dbs/main_migrations')
const { authDBMigrations } = require('./dbs/auth_migrations')

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World!\n')
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
});

mainDBMigrations()
authDBMigrations()
