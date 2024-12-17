const express = require('express');
const transactionController = require('../controllers/TransactionController');

const router = express.Router();

router.post('/send_payment', transactionController.sendPayment);
router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);
router.get('/transactions', transactionController.getTransactions);

module.exports = router;