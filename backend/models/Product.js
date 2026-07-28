import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

  const productSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, default: '' }
      }
    ],
    video: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: true,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
    },
    ingredients: {
      type: String,
      default: '',
    },
    howToUse: {
      type: String,
      default: '',
    },
    benefits: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: [
        {
          name: String,
          value: String
        }
      ],
      default: [],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0, 
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    tabCategory: {
      type: String,
      default: '',
    },
    sku: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    hoverImage: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: [],
    },
    variants: {
      type: [
        {
          name: String,
          options: [String]
        }
      ],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
    relatedProducts: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }],
      default: [],
    },
    coreFeatures: {
      type: [
        {
          title: String,
          description: String
        }
      ],
      default: []
    },
    howToUseSteps: {
      type: [
        {
          image: String,
          title: String,
          description: String
        }
      ],
      default: []
    },
    shippingInfo: {
      type: String,
      default: ''
    },
    returnPolicy: {
      type: String,
      default: ''
    },
    careInstructions: {
      type: String,
      default: ''
    },
    vendor: {
      type: String,
      default: ''
    },
    productType: {
      type: String,
      default: ''
    },
    warranty: {
      type: String,
      default: ''
    },
    featureIcons: {
      type: [
        {
          icon: String,
          text: String
        }
      ],
      default: []
    },
    safeCheckout: {
      type: Boolean,
      default: true
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
