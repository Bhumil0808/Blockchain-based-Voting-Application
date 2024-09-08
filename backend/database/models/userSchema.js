// server/models/userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'voter' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;