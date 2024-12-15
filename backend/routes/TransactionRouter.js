const express = require('express');
const transactionController = require('../controllers/TransactionController');

const router = express.Router();

router.post('/create_transaction', transactionController.createTransaction);

module.exports = router;