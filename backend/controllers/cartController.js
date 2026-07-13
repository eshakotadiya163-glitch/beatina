import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity = Number(quantity);
      await cart.save();
      const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      res.json(updatedCart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart or clear cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart };
