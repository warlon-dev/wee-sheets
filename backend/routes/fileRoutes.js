const multer = require('multer');
const express = require('express');

const fileControllers = require('../controllers/fileControllers.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/', encoding: 'binary' });

// orders Routes
router.post('/upload', upload.array('files', { limits: { fileSize: 5 * 1024 * 1024 } }), fileControllers.upload);

module.exports = router;