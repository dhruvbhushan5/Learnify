  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs'); // Import bcrypt

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'tutor'], default: 'student' }
  });

  // Hash the password before saving to the database
  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  // Compare input password with stored hashed password
  userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };

  module.exports = mongoose.model('User', userSchema);
