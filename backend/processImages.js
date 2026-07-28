const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/aura_collection';
const SOURCE_DIR = path.join(__dirname, '../frontend/public/images/products');

async function processImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();

    for (const product of products) {
      const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const productDir = path.join(SOURCE_DIR, slug);
      
      if (!fs.existsSync(productDir)) {
        console.log(`Directory not found for ${product.name}: ${productDir}`);
        continue;
      }

      const files = fs.readdirSync(productDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
      const newImages = [];
      let mainImage = '';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputPath = path.join(productDir, file);
        
        let newName = '';
        if (i === 0) newName = 'main-large.webp';
        else newName = `gallery-${i}.webp`;
        
        const outputPath = path.join(productDir, newName);

        // Process image: trim transparent/white borders, then resize/save as webp
        // We'll use sharp's trim feature. To ensure it's not tiny, we don't scale it down if it's large.
        // We'll just trim and convert to high quality WebP.
        await sharp(inputPath)
          .trim() // removes transparent or white background
          .webp({ quality: 95 })
          .toFile(outputPath);

        const relativePath = `/images/products/${slug}/${newName}`;
        newImages.push(relativePath);
        if (i === 0) mainImage = relativePath;
      }

      if (newImages.length > 0) {
        await db.collection('products').updateOne(
          { _id: product._id },
          { 
            $set: { 
              image: mainImage,
              images: newImages 
            } 
          }
        );
        console.log(`Updated images for ${product.name}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

processImages();
