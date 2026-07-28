import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }

    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
      res.status(400);
      throw new Error('This email is already subscribed');
    }

    const newSubscription = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter',
      data: newSubscription,
    });
  } catch (error) {
    next(error);
  }
};
