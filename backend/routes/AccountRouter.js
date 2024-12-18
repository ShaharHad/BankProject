const express = require('express');
const accountController = require('../controllers/AccountController');

const router = express.Router(); 

// router.post('/change_password', accountController.changePassword); TODO finish if have time
router.get('/balance', accountController.getBalance);
router.get('/', accountController.getAccount);

module.exports = router;