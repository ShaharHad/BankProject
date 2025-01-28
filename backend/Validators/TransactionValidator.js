const { checkSchema } = require('express-validator');

const paymentValidateSchema = checkSchema({
    receiver: {
        isEmail: { errorMessage: "Please provide valid receiver email" },
    },
    amount: {
        exists: { errorMessage: "Amount is required" },
        isInt: { errorMessage: "Amount should be number" },
        custom: {
            options: (value) => {
                return value > 0;

            },
            errorMessage: "Amount should be greater than 0",
        },
    },
});


const depositValidateSchema = checkSchema({
    amount: {
        exists: { errorMessage: "Amount is required" },
        isInt: { errorMessage: "Amount should be number" },
        custom: {
            options: (value) => {
                return value > 0;

            },
            errorMessage: "Amount should be greater than 0",
        },
    },
});

const withdrawValidateSchema = checkSchema({
    amount: {
        exists: { errorMessage: "Amount is required" },
        isInt: { errorMessage: "Amount should be number" },
        custom: {
            options: (value) => {
                return value > 0;

            },
            errorMessage: "Amount should be greater than 0",
        },
    },
});

module.exports = { paymentValidateSchema, depositValidateSchema, withdrawValidateSchema };
