const express = require('express');

const messagesControllers = require('../controllers/messagesControllers.js');

const router = express.Router();

// orders Routes
router.get('/', messagesControllers.loadMessages);
router.post('/send', messagesControllers.saveMessage);

module.exports = router;