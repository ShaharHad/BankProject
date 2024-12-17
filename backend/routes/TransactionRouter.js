const express = require('express');
const transactionController = require('../controllers/TransactionController');

const router = express.Router();

router.post('/send_payment', transactionController.sendPayment);

module.exports = router;