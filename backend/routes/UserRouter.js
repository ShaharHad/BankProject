const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router(); 

router.post('/change_password', userController.changePassword);
router.get('/get_balance', userController.getBalance);
router.get('/get_data', userController.getUser);

module.exports = router;