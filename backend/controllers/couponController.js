import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchaseAmount, expirationDate, isActive } = req.body;
    
    const couponExists = await Coupon.findOne({ code });
    
    if (couponExists) {
      res.status(400);
      throw new Error('Coupon already exists');
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      expirationDate,
      isActive
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;
    
    const coupon = await Coupon.findOne({ code });
    
    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    if (!coupon.isActive) {
      res.status(400);
      throw new Error('Coupon is no longer active');
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      res.status(400);
      throw new Error(`Minimum purchase amount of $${coupon.minPurchaseAmount} is required`);
    }

    res.json({
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await Coupon.deleteOne({ _id: coupon._id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getCoupons, createCoupon, validateCoupon, deleteCoupon };
