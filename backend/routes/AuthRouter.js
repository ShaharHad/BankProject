const express = require('express');
const authController = require('../controllers/AuthController');
const {registerValidateSchema, loginValidateSchema} = require('../Validators/AuthValidator');
const {validationResult} = require("express-validator");
const {createError} = require("../utils/CreateError");

const router = express.Router();

router.post('/register', registerValidateSchema, async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(createError(400, errors.array()[0].msg));
    }
    authController.register(req, res, next);
});

router.post('/login', loginValidateSchema, async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(createError(400, errors.array()[0].msg));
    }
    authController.login(req, res, next);
});

router.get('/activateAccount/:token', authController.activateAccount);

module.exports = router;