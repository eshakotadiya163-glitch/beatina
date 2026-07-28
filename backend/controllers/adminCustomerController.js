import User from '../models/User.js';
import Order from '../models/Order.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import bcrypt from 'bcryptjs';

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user', isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get customer profile with history
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Fetch histories
    const purchases = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    const appointments = await Appointment.find({ customer: req.params.id }).sort({ date: -1 }).populate('services');
    const payments = await Payment.find({ customer: req.params.id }).sort({ paymentDate: -1 });

    res.json({
      customer,
      purchases,
      appointments,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new customer
// @route   POST /api/admin/customers
// @access  Private/Admin
export const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (exists) {
      return res.status(400).json({ message: 'Customer with this email or phone already exists' });
    }

    const customer = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      role: 'user',
      isAdmin: false,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/admin/customers/:id
// @access  Private/Admin
export const updateCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { firstName, lastName, email, phoneNumber } = req.body;

    customer.firstName = firstName || customer.firstName;
    customer.lastName = lastName || customer.lastName;
    customer.email = email || customer.email;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.isAdmin || customer.role === 'admin' || customer.role === 'superadmin') {
      return res.status(400).json({ message: 'Cannot delete an admin from customer module' });
    }

    await User.deleteOne({ _id: customer._id });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
