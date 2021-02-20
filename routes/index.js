const express = require('express');
const router = express.Router();

// Hello World
router.get('/', function (req, res) {
  try {
    res.send('Hello World');
  } catch (err) {
    console.error(err)
    return res.status(400).json({error: 'Failed to say hello :('})
  }
})

module.exports = router
