import User from '../models/User.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (!user.wishlist.includes(req.params.id)) {
        user.wishlist.push(req.params.id);
        await user.save();
      }
      res.json(user.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== req.params.id.toString()
      );
      await user.save();
      res.json(user.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { addToWishlist, removeFromWishlist, getWishlist };
