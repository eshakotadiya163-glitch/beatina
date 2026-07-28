import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Make optional for phone-only users
      sparse: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for OTP users
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVendor: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'staff', 'admin', 'superadmin'],
      default: 'user',
    },
    permissions: [{
      type: String, // e.g., 'manage_leads', 'manage_users'
    }],
    staffDetails: {
      designation: String,
      department: String,
      isActive: { type: Boolean, default: true },
    },
    addresses: [addressSchema],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
