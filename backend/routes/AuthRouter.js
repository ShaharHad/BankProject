const express = require('express');
const authController = require('../controllers/AuthController');

const router = express.Router(); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/activateAccount/:token', authController.activateAccount);

module.exports = router;