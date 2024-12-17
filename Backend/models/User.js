
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    profilePicture: { type: String, default: 'defaultProfilePic.jpg' },
    CO2Goal: { type: String, default: '0' }, // Profile picture field
    role: { type: String, default: 'user' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    twoFactorSecret: String, 
    twoFactorCode: String,
    twoFactorCodeExpires: Date,
    isTwoFactorEnabled: { type: Boolean, default: false }, 
  });
  


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 3600000; 
    return resetToken;
  };

module.exports = mongoose.model('User', UserSchema);
