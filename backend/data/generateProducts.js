import fs from 'fs';

const categories = [
  'Body Care', 'Skin Care', 'Hair Care', 'Wellness', 
  'Bath & Shower', 'Intimate Care', 'Fragrance', 'Gift Sets'
];

const brands = [
  'The Woman Company', 'Aura Beauty', 'Lumina Luxe', 
  'Botanica Essences', 'Silk & Soul', 'DermaGlow'
];

// Mapping product types to specific premium Unsplash photos
const imageMap = {
  'Body Care': [
    'https://images.unsplash.com/photo-1614859324967-bdf45d8b8431?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248593842-8021a8d0b57e?auto=format&fit=crop&w=800&q=80'
  ],
  'Skin Care': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615397323214-3a7894a7e930?auto=format&fit=crop&w=800&q=80'
  ],
  'Hair Care': [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=800&q=80'
  ],
  'Wellness': [
    'https://images.unsplash.com/photo-1598444747738-963b516b24d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
  ],
  'Bath & Shower': [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'
  ],
  'Intimate Care': [
    'https://images.unsplash.com/photo-1556228720-192a6af4e86e?auto=format&fit=crop&w=800&q=80' // subtle flatlays
  ],
  'Fragrance': [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'
  ],
  'Gift Sets': [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80'
  ]
};

const productTypes = {
  'Body Care': ['Body Wash', 'Body Lotion', 'Body Butter'],
  'Skin Care': ['Face Wash', 'Cleanser', 'Moisturizer', 'Face Serum', 'Sunscreen', 'Lip Balm'],
  'Hair Care': ['Shampoo', 'Conditioner', 'Hair Serum', 'Hair Mask'],
  'Wellness': ['Silk Sleep Mask', 'Facial Roller', 'Gua Sha', 'Relaxation Tea'],
  'Bath & Shower': ['Shower Gel', 'Bath Salt', 'Bath Bomb', 'Exfoliating Scrub'],
  'Intimate Care': ['Intimate Wash', 'Soothing Gel', 'pH Balance Wipes'],
  'Fragrance': ['Eau de Parfum', 'Body Mist', 'Roll-on Perfume', 'Solid Perfume'],
  'Gift Sets': ['Ultimate Glow Box', 'Travel Essentials Kit', 'Spa Day Bundle', 'Bridal Kit']
};

const adjectives = ['Luminous', 'Velvet', 'Botanical', 'Midnight', 'Radiant', 'Hydrating', 'Soothing', 'Revitalizing', 'Purifying', 'Essential', 'Divine', 'Pure', 'Nourishing'];

const generateProducts = () => {
  const products = [];
  
  for (let i = 1; i <= 200; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const typeList = productTypes[category];
    const type = typeList[Math.floor(Math.random() * typeList.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const name = `${adj} ${type}`;
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + i;
    
    const catImages = imageMap[category] || imageMap['Skin Care'];
    const imageUrl = catImages[Math.floor(Math.random() * catImages.length)];
    
    // Slight randomization on images to avoid caching bugs, though unsplash handles it ok.
    const finalUrl = `${imageUrl}&sig=${i}`;

    const price = Math.floor(Math.random() * (4999 - 299 + 1)) + 299; // Rs 299 to 4999
    
    products.push({
      name,
      slug,
      images: [
        { url: finalUrl, altText: name }
      ],
      brand,
      description: `Experience the luxury of our premium ${type}. Formulated with the finest ingredients to give you the ultimate ${category.toLowerCase()} experience. Crafted meticulously by ${brand}.`,
      ingredients: 'Aqua, Premium Extracts, Essential Oils, Vitamins, Natural Preservatives.',
      howToUse: 'Apply as directed. For external use only. Avoid contact with eyes.',
      benefits: ['Premium Quality', 'Dermatologist Tested', 'Cruelty Free', 'Natural Extracts'],
      price: price,
      countInStock: Math.floor(Math.random() * 100) + 10,
      rating: (Math.random() * (5.0 - 3.8) + 3.8).toFixed(1),
      numReviews: Math.floor(Math.random() * 500) + 5,
      isFeatured: Math.random() > 0.8, // ~20% featured
      category: category
    });
  }

  return products;
};

const productsData = generateProducts();
const fileContent = `const products = ${JSON.stringify(productsData, null, 2)};\n\nexport default products;\n`;

fs.writeFileSync('./products.js', fileContent);
console.log('Successfully generated 200 products in products.js');
