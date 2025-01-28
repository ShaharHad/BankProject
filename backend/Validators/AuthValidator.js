const { checkSchema } = require('express-validator');

const registerValidateSchema = checkSchema({
    name: {
        exists: {
            errorMessage: "Name is required",
            options: { checkFalsy: true }, // if the variable is null/0/""/false ... validation is fail
        },
        isString: { errorMessage: "Name should be string" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "password should be string" },
        isLength: {
            options: { min: 5 },
            errorMessage: "Password should be at least 5 characters",
        },
    },
    email: {
        isEmail: { errorMessage: "Please provide valid email" },
    },
    phone: {
        isString: { errorMessage: "Phone number should be string" },
        isLength: {
            options: { min: 10, max: 10 },
            errorMessage: "Phone number should be exactly 10 digits",
        },
        isNumeric: { errorMessage: "Phone number should only contain digits" },
    },
});


const loginValidateSchema = checkSchema({
    email: {
        isEmail: { errorMessage: "Please provide valid email" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "password should be string" },
        isLength: {
            options: { min: 5 },
            errorMessage: "Password should be at least 5 characters",
        },
    },

});

module.exports = { registerValidateSchema, loginValidateSchema };
