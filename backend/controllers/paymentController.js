import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body; // Amount should be in smaller unit (paise)

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        res.status(500);
        throw new Error('Razorpay keys are not configured');
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      res.status(500);
      throw new Error('Some error occured while creating Razorpay order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400);
      throw new Error('Invalid signature sent!');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get Razorpay Key
// @route   GET /api/payment/razorpay/key
// @access  Private
const getRazorpayKey = (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID });
}

export { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey };
