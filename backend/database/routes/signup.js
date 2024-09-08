// server/routes/signup.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { voterId, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });


    const newUser = new User({ voterId, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;    