const express = require('express');
const userController = require('../controllers/UserController');

const router = express.Router(); 

router.get('/get_data', userController.changePassword);

module.exports = router;