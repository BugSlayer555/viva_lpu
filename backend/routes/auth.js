const express = require('express');
const router = express.Router();

// Signup route example
router.post('/signup', (req, res) => {
  // Yahan pe tum user ko DB mein save karoge (abhi dummy response de rahe hain)
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password required' });
  }
  // User creation logic yahan aayega (DB interaction)
  res.status(201).json({ msg: 'User registered successfully', user: { username } });
});

// Login route example
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password required' });
  }
  // Authentication logic yahan aayega (DB se user check karna)
  res.json({ msg: 'Login successful', user: { username } });
});

module.exports = router;
