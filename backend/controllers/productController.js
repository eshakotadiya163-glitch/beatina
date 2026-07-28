import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search keyword
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // Category
    const category = req.query.category ? { category: req.query.category } : {};

    // Brand
    const brand = req.query.brand ? { brand: { $regex: req.query.brand, $options: 'i' } } : {};

    // Price range
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 1000000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // Rating
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Availability
    const stockFilter = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

    // Vendor filter
    const vendorFilter = req.query.vendor ? { vendor: req.query.vendor } : {};

    const queryFilter = { ...keyword, ...category, ...brand, ...priceFilter, ...ratingFilter, ...stockFilter, ...vendorFilter };

    // Sorting
    let sortObj = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') sortObj = { price: 1 };
      else if (req.query.sort === 'price_desc') sortObj = { price: -1 };
      else if (req.query.sort === 'rating') sortObj = { rating: -1 };
      else if (req.query.sort === 'newest') sortObj = { createdAt: -1 };
    }

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const isValidObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const product = isValidObjectId 
      ? await Product.findById(req.params.id).populate('category', 'name slug')
      : await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const categorySlug = req.params.slug;
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Search keyword
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // Price range
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 1000000;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // Rating
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Availability
    const stockFilter = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

    const queryFilter = { category: category._id, ...keyword, ...priceFilter, ...ratingFilter, ...stockFilter };

    // Sorting
    let sortObj = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') sortObj = { price: 1 };
      else if (req.query.sort === 'price_desc') sortObj = { price: -1 };
      else if (req.query.sort === 'rating') sortObj = { rating: -1 };
      else if (req.query.sort === 'newest') sortObj = { createdAt: -1 };
    }

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count, category });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: 'Sample name',
      slug: `sample-name-${Date.now()}`,
      price: 0,
      compareAtPrice: 0,
      discount: 0,
      user: req.user._id,
      images: [{ url: '/images/sample.jpg', altText: 'Sample Image' }],
      video: '',
      brand: 'Sample brand',
      category: req.body.category || '60d5ec496cb91e0015f8a000', 
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
      shortDescription: '',
      ingredients: '',
      howToUse: '',
      howToUseSteps: [],
      coreFeatures: [],
      shippingInfo: 'Standard shipping times apply.',
      returnPolicy: '30 days return policy.',
      careInstructions: '',
      vendor: req.user._id, // Assign to current user as vendor
      productType: '',
      warranty: '',
      featureIcons: [],
      safeCheckout: true,
      benefits: [],
      sku: `SKU-${Date.now()}`,
      features: [],
      specifications: [],
      sizes: [],
      tags: [],
      variants: [],
      relatedProducts: [],
      seoTitle: '',
      seoDescription: ''
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      price,
      compareAtPrice,
      discount,
      description,
      shortDescription,
      images,
      video,
      brand,
      category,
      countInStock,
      ingredients,
      howToUse,
      howToUseSteps,
      coreFeatures,
      shippingInfo,
      returnPolicy,
      careInstructions,
      vendor,
      productType,
      warranty,
      featureIcons,
      safeCheckout,
      benefits,
      features,
      specifications,
      sizes,
      sku,
      tags,
      variants,
      relatedProducts,
      seoTitle,
      seoDescription,
      isFeatured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is vendor of this product or admin
      if (product.vendor?.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to update this product');
      }

      product.name = name || product.name;
      product.slug = slug || product.slug;
      product.price = price !== undefined ? price : product.price;
      product.compareAtPrice = compareAtPrice !== undefined ? compareAtPrice : product.compareAtPrice;
      product.discount = discount !== undefined ? discount : product.discount;
      product.description = description || product.description;
      product.shortDescription = shortDescription !== undefined ? shortDescription : product.shortDescription;
      product.images = images || product.images;
      product.video = video !== undefined ? video : product.video;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.ingredients = ingredients !== undefined ? ingredients : product.ingredients;
      product.howToUse = howToUse !== undefined ? howToUse : product.howToUse;
      product.howToUseSteps = howToUseSteps !== undefined ? howToUseSteps : product.howToUseSteps;
      product.coreFeatures = coreFeatures !== undefined ? coreFeatures : product.coreFeatures;
      product.shippingInfo = shippingInfo !== undefined ? shippingInfo : product.shippingInfo;
      product.returnPolicy = returnPolicy !== undefined ? returnPolicy : product.returnPolicy;
      product.careInstructions = careInstructions !== undefined ? careInstructions : product.careInstructions;
      product.vendor = vendor !== undefined ? vendor : product.vendor;
      product.productType = productType !== undefined ? productType : product.productType;
      product.warranty = warranty !== undefined ? warranty : product.warranty;
      product.featureIcons = featureIcons || product.featureIcons;
      product.safeCheckout = safeCheckout !== undefined ? safeCheckout : product.safeCheckout;
      product.benefits = benefits || product.benefits;
      product.features = features || product.features;
      product.specifications = specifications || product.specifications;
      product.sizes = sizes || product.sizes;
      product.sku = sku !== undefined ? sku : product.sku;
      product.tags = tags || product.tags;
      product.variants = variants || product.variants;
      product.relatedProducts = relatedProducts || product.relatedProducts;
      product.seoTitle = seoTitle !== undefined ? seoTitle : product.seoTitle;
      product.seoDescription = seoDescription !== undefined ? seoDescription : product.seoDescription;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user is vendor of this product or admin
      if (product.vendor?.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to delete this product');
      }

      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const isValidObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const product = isValidObjectId 
      ? await Product.findById(req.params.id)
      : await Product.findOne({ slug: req.params.id });

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsByCategory,
};
