const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/taskController');

// Signup route example
router.post('/signup', registerUser);

// Login route example
router.post('/login', loginUser);

module.exports = router;
