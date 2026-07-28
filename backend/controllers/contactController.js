import Contact from '../models/Contact.js';
import asyncHandler from 'express-async-handler';

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    message,
  });

  if (contact) {
    res.status(201).json({
      _id: contact._id,
      message: 'Contact message submitted successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid contact data');
  }
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await Contact.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

export { submitContactMessage, getContactMessages };
