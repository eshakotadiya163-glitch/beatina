import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { adminAuth } from '../config/firebase.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user via Firebase (Phone OTP / Google / Facebook)
// @route   POST /api/users/firebase-auth
// @access  Public
const firebaseAuth = async (req, res, next) => {
  try {
    const { token, firstName, lastName } = req.body;
    
    if (!token) {
      res.status(400);
      throw new Error('No Firebase token provided');
    }

    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const phoneNumber = decodedToken.phone_number;
    const email = decodedToken.email;
    const displayName = decodedToken.name || '';
    const photoURL = decodedToken.picture || '';

    let user;

    if (email) {
      // Google / Facebook / Email login
      user = await User.findOne({ email });

      if (!user) {
        // Split displayName into first/last
        const nameParts = displayName.split(' ');
        const fName = firstName || nameParts[0] || 'User';
        const lName = lastName || nameParts.slice(1).join(' ') || '';

        user = await User.create({
          firstName: fName,
          lastName: lName,
          email,
          photoURL,
          // Set a random password since they use social login
          password: crypto.randomBytes(20).toString('hex'),
        });
      }
    } else if (phoneNumber) {
      // Phone OTP login
      user = await User.findOne({ phoneNumber });

      if (!user) {
        user = await User.create({
          firstName: firstName || 'User',
          lastName: lastName || '',
          phoneNumber,
        });
      }
    } else {
      res.status(400);
      throw new Error('Token does not contain email or phone number');
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    console.error('Firebase Auth Error:', error);
    res.status(401);
    throw new Error('Invalid Firebase token');
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        addresses: user.addresses,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404);
      throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    // Support alternative port as per recent fix
    const altResetUrl = `http://localhost:5174/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\n Or ${altResetUrl} \n\nIf you did not request this, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const newAddress = {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        isDefault: req.body.isDefault || false,
      };

      if (newAddress.isDefault) {
        user.addresses.forEach(addr => (addr.isDefault = false));
      } else if (user.addresses.length === 0) {
        newAddress.isDefault = true;
      }

      user.addresses.push(newAddress);
      await user.save();
      res.status(201).json(user.addresses);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Edit user address
// @route   PUT /api/users/addresses/:id
// @access  Private
const editAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const address = user.addresses.id(req.params.id);
      
      if (address) {
        address.street = req.body.street || address.street;
        address.city = req.body.city || address.city;
        address.state = req.body.state || address.state;
        address.postalCode = req.body.postalCode || address.postalCode;
        address.country = req.body.country || address.country;
        
        if (req.body.isDefault !== undefined) {
          if (req.body.isDefault) {
            user.addresses.forEach(addr => (addr.isDefault = false));
            address.isDefault = true;
          } else {
            address.isDefault = false;
          }
        }
        
        await user.save();
        res.json(user.addresses);
      } else {
        res.status(404);
        throw new Error('Address not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const address = user.addresses.id(req.params.id);
      if (address) {
        user.addresses.pull(req.params.id);
        
        // If deleted address was default, set the first remaining to default
        if (address.isDefault && user.addresses.length > 0) {
          user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json(user.addresses);
      } else {
        res.status(404);
        throw new Error('Address not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Set address as default
// @route   PUT /api/users/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const address = user.addresses.id(req.params.id);
      if (address) {
        user.addresses.forEach(addr => (addr.isDefault = false));
        address.isDefault = true;
        
        await user.save();
        res.json(user.addresses);
      } else {
        res.status(404);
        throw new Error('Address not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : user.isAdmin;
      user.isVendor = req.body.isVendor !== undefined ? Boolean(req.body.isVendor) : user.isVendor;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isVendor: updatedUser.isVendor,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  firebaseAuth,
};
