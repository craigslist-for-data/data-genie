const express = require('express');
const router = express.Router();

// Hello World
router.get('/', function (req, res) {
  res.send('Hello World');
})

module.exports = router
