const express = require('express');
const router = express.Router();

// Hello World
router.get('/', function (req, res) {
  res.send('Hellow World');
})

module.exports = router
