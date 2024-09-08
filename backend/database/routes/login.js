const express = require('express');
const User = require('../models/userSchema');
const nodemailer = require('nodemailer');
const router = express.Router();
const otpMap = new Map(); // In-memory storage for OTPs (for demonstration)

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'getotp.blockballot@gmail.com', // Replace with your email
    pass: 'zwxf avud hwlo bjlw',  // Replace with your email password
  },
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { voterId } = req.body;

  try {
    const user = await User.findOne({ voterId });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    otpMap.set(voterId, otp); // Store OTP with voterId

    // Send OTP via email
    const mailOptions = {
      from: 'getotp.blockballot@gmail.com',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP and login
router.post('/login', async (req, res) => {
  const { voterId, otp } = req.body;

  try {
    const user = await User.findOne({ voterId });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const storedOtp = otpMap.get(voterId);
    if (storedOtp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    otpMap.delete(voterId); // OTP is valid, remove it

    res.status(200).json({ role: user.role, id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
