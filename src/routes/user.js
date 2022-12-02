const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");

// GET all users
router.get('/', userController.users_get);

// POST Login for a user
router.post('/login', userController.login_post);

// POST Register a user
router.post('/register', userController.register_post);

// GET single user
router.get('/:userId', userController.user_get);

module.exports = router;