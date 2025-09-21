const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'user', avatar } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all required fields
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      joinDate: new Date(),
      status: 'active',
      totalBookings: 0,
      avatar: avatar || ''
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

module.exports = router;
