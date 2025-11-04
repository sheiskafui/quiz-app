import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true },
  password: { 
    type: String, 
    required: true },
  verified: { 
    type: Boolean, 
    default: false },
  verificationToken: { 
    type: String },
  refreshToken: { 
    type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' }
}, { timestamps: true });

// Hash password before it is saved
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// method to compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;