const fs = require('fs');

let content = fs.readFileSync('./data/products.js', 'utf8');
let dataStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let products;
try {
  products = eval(dataStr);
} catch (e) {
  console.error("Eval failed:", e);
  process.exit(1);
}

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const allBenefits = [
  'Deeply hydrates and plumps the skin',
  'Reduces appearance of fine lines',
  'Improves skin elasticity',
  'Brightens dull complexion',
  'Minimizes pore size visibly',
  'Evens out skin tone',
  'Soothes irritated skin',
  'Protects against environmental stressors',
  'Promotes natural collagen production',
  'Leaves skin feeling silky smooth'
];

const allFeatures = [
  'Cruelty-Free',
  'Vegan',
  'Dermatologist Tested',
  'Recyclable Packaging',
  'Paraben-Free',
  'Sulfate-Free',
  'Artificial Fragrance-Free',
  'Clinically Proven'
];

const allIngredients = [
  'Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Aloe Barbadensis Leaf Juice, Squalane, Ceramide NP, Tocopherol.',
  'Aqua, Vitamin C (Ascorbic Acid), Ferulic Acid, Rosehip Oil, Botanical Extracts, Panthenol, Phenoxyethanol.',
  'Aqua, Salicylic Acid, Glycolic Acid, Lactic Acid, Witch Hazel Extract, Green Tea Extract, Chamomile.',
  'Aqua, Peptides, Retinol, Jojoba Oil, Shea Butter, Sunflower Seed Oil, Squalane, Vitamin E.',
  'Aqua, Bentonite Clay, Kaolin, Charcoal Powder, Tea Tree Leaf Oil, Eucalyptus Extract, Zinc Oxide.'
];

const howToUseList = [
  'Apply 2-3 drops to clean, dry skin morning and night. Follow with your favorite moisturizer.',
  'Massage a small amount into face and neck using upward strokes. Use daily.',
  'Apply a thin layer to the affected area. Leave on for 10-15 minutes, then rinse with warm water.',
  'Gently pat around the eye contour area until fully absorbed.',
  'Lather into wet hair and scalp. Rinse thoroughly. Follow with conditioner.'
];

products.forEach(p => {
  // Generate realistic unique details based on product name
  const nameL = p.name.toLowerCase();
  
  if (nameL.includes('serum') || nameL.includes('concentrate')) {
    p.description = `Experience the ultimate transformation with the ${p.name}. This powerful serum penetrates deep into the skin to deliver concentrated active ingredients. Designed to target specific skin concerns, it provides visible results in just a few weeks. The lightweight, fast-absorbing formula leaves no sticky residue.`;
    p.shortDescription = `A highly concentrated active serum for targeted results.`;
    p.category = 'Skin Care';
  } else if (nameL.includes('cream') || nameL.includes('moisturiser')) {
    p.description = `Nourish and protect your skin with the ${p.name}. This rich, luxurious cream locks in moisture and fortifies the skin's natural barrier. Ideal for daily use, it combats dryness and leaves your skin feeling incredibly soft, supple, and radiant all day long.`;
    p.shortDescription = `A rich and deeply nourishing daily moisture cream.`;
    p.category = 'Skin Care';
  } else if (nameL.includes('mask') || nameL.includes('peel')) {
    p.description = `Revitalize your complexion with the ${p.name}. This intensive treatment draws out impurities, unclogs pores, and sloughs away dead skin cells. Experience a spa-like facial at home and reveal a brighter, smoother, and more refined skin texture.`;
    p.shortDescription = `An intensive treatment for a brighter, refined complexion.`;
    p.category = 'Skin Care';
  } else if (nameL.includes('shampoo') || nameL.includes('conditioner') || nameL.includes('hair')) {
    p.description = `Transform your haircare routine with the ${p.name}. Formulated with strengthening botanical extracts, it cleanses gently while delivering intense hydration. Achieve salon-worthy shine, bounce, and manageability with every wash.`;
    p.shortDescription = `Premium haircare for intense hydration and shine.`;
    p.category = 'Hair Care';
  } else {
    p.description = `Discover the outstanding quality of the ${p.name}. Expertly crafted to elevate your daily routine, this premium product delivers exceptional performance and visible results. Infused with carefully selected natural ingredients for maximum efficacy.`;
    p.shortDescription = `A premium formulation designed for exceptional results.`;
  }

  p.ingredients = getRandomItem(allIngredients);
  p.howToUse = getRandomItem(howToUseList);
  
  // Random 3-4 benefits
  p.benefits = [];
  while(p.benefits.length < 3) {
    const b = getRandomItem(allBenefits);
    if (!p.benefits.includes(b)) p.benefits.push(b);
  }

  // Random 3-4 features
  p.features = ['Cruelty-Free', 'Vegan'];
  while(p.features.length < 4) {
    const f = getRandomItem(allFeatures);
    if (!p.features.includes(f)) p.features.push(f);
  }

  p.specifications = [
    { name: 'Skin Type', value: getRandomItem(['All Skin Types', 'Dry Skin', 'Oily/Combination Skin', 'Sensitive Skin']) },
    { name: 'Formulation', value: getRandomItem(['Liquid', 'Cream', 'Gel', 'Oil', 'Clay']) },
    { name: 'Origin', value: 'Made in EU' },
    { name: 'Shelf Life', value: '12 Months after opening' }
  ];

  p.sizes = getRandomItem([
    ['Standard (50ml)', 'Travel Size (15ml)'],
    ['100ml', '200ml'],
    ['Standard (30ml)'],
    ['Single Use (1 mask)', 'Pack of 5']
  ]);

  p.sku = p.slug.substring(0, 5).toUpperCase() + '-' + getRandomInt(1000, 9999);
  
  p.rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
  p.numReviews = getRandomInt(10, 300);
  
  // Generate random reviews
  p.reviews = Array(getRandomInt(2, 5)).fill(0).map((_, i) => {
    return {
      name: ['Emma', 'Sophia', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia'][getRandomInt(0, 7)] + ' ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][getRandomInt(0, 7)],
      rating: getRandomInt(4, 5),
      comment: getRandomItem([
        'Absolutely love this product! It changed my skin completely.',
        'Great texture and absorbs quickly. Will buy again.',
        'Smells amazing and feels so luxurious. Highly recommend!',
        'It is decent, but I wish the bottle was a bit bigger.',
        'A holy grail in my routine now. My skin has never looked better.',
        'Very gentle on my sensitive skin. I am very impressed.',
        'Results were visible within the first week of using it.'
      ]),
      createdAt: new Date(Date.now() - getRandomInt(1, 100) * 24 * 60 * 60 * 1000).toISOString()
    };
  });

  p.seoTitle = `${p.name} | Beautina Official`;
  p.seoDescription = p.shortDescription;
});

const updatedStr = 'const products = ' + JSON.stringify(products, null, 2) + ';\n\nexport default products;\n';
fs.writeFileSync('./data/products.js', updatedStr);
console.log('Products updated with unique dynamic details!');
