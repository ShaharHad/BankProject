const express = require('express');
const messageController = require('../controllers/MessageController');

const router = express.Router();

router.put('/', messageController.setReadMessage);

router.get('/', messageController.getAllMessages);

module.exports = router;