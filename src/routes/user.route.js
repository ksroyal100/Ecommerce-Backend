const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')

router.get('/profile', userController.getUserProfile);
router.get('/', userController.getAllUsers)

module.exports = router 