const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: {
    type: Number,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
  }
});

module.exports = mongoose.model('Otp', otpSchema);