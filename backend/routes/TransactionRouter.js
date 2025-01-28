const express = require('express');
const transactionController = require('../controllers/TransactionController');
const { paymentValidateSchema, depositValidateSchema, withdrawValidateSchema } = require('../Validators/TransactionValidator');
const {validationResult} = require("express-validator");
const {createError} = require("../utils/CreateError");

const router = express.Router();

router.post('/payment', paymentValidateSchema, async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(createError(400, errors.array()[0].msg));
    }

    transactionController.sendPayment(req, res, next);
});


router.post('/deposit', depositValidateSchema, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(createError(400, errors.array()[0].msg));
    }
    transactionController.deposit(req, res, next);
});

router.post('/withdraw', withdrawValidateSchema, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(createError(400, errors.array()[0].msg));
    }
    transactionController.withdraw(req, res, next);
});


router.get('/', transactionController.getTransactions);

module.exports = router;