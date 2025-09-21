const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, default: 'active' },
  totalBookings: { type: Number, default: 0 },
  avatar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
