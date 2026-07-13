const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const brainDir = 'C:/Users/eshak/.gemini/antigravity/brain/6187fdb0-666e-413f-9ccc-7086efe5ab29';
const destDir = 'E:/aura collection/frontend/public/assets/products';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  { old: 'media__1783782595291.png', new: 'niacinamide-serum-front.png' },
  { old: 'media__1783782595300.png', new: 'aha-peel-mask-sachet.png' },
  { old: 'media__1783782595308.png', new: 'aha-peel-mask-tube.png' },
  { old: 'media__1783782595322.png', new: 'niacinamide-serum-hand.png' },
  { old: 'media__1783782595340.png', new: 'lifestyle-face-mask.png' }
];

for (const f of files) {
  const src = path.join(brainDir, f.old);
  const dest = path.join(destDir, f.new);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Copied', f.new);
  } else {
    console.log('Missing', f.old);
  }
}

mongoose.connect('mongodb://localhost:27017/aura_collection').then(async () => {
  const db = mongoose.connection.db;
  
  await db.collection('products').updateOne(
    { slug: 'niacinamide-alternative-5-in-1-serum' },
    { $set: { 
        image: '/assets/products/niacinamide-serum-front.png',
        images: ['/assets/products/niacinamide-serum-front.png', '/assets/products/niacinamide-serum-hand.png']
    }}
  );
  console.log('Updated Niacinamide');

  await db.collection('products').updateOne(
    { slug: 'brightening-aha-peel-mask' },
    { $set: { 
        image: '/assets/products/aha-peel-mask-tube.png',
        images: ['/assets/products/aha-peel-mask-tube.png', '/assets/products/aha-peel-mask-sachet.png']
    }}
  );
  console.log('Updated AHA Peel');
  
  process.exit(0);
});
