import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Strip HTML from body_html
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate slug from title
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const seedFromShopify = async () => {
  await connectDB();

  const dataPath = path.join(__dirname, 'shopify_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('shopify_data.json not found. Run scrapeShopify.js first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const shopifyProducts = data.products || [];
  const shopifyCollections = data.collections || [];

  console.log(`Loaded ${shopifyProducts.length} products and ${shopifyCollections.length} collections from shopify_data.json`);

  // Step 1: Delete all placeholder/old products
  console.log('\nDeleting all existing products...');
  const deleteResult = await Product.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} products.`);

  // Step 2: Create/upsert categories from Shopify collections
  console.log('\nCreating categories from Shopify collections...');
  const categoryMap = {};

  // Default fallback category
  const fallbackCat = await Category.findOneAndUpdate(
    { slug: 'all' },
    { name: 'All Products', slug: 'all', description: 'All Beautina products' },
    { upsert: true, new: true }
  );
  categoryMap['all'] = fallbackCat._id;

  for (const col of shopifyCollections) {
    const cat = await Category.findOneAndUpdate(
      { slug: col.handle },
      {
        name: col.title,
        slug: col.handle,
        description: col.body_html ? stripHtml(col.body_html) : col.title,
        image: col.image?.src || '',
      },
      { upsert: true, new: true }
    );
    categoryMap[col.handle] = cat._id;
    console.log(`  Category: ${col.title} (${col.handle})`);
  }

  // Step 3: Map product types to category handles
  const productTypeToCategory = {
    'SETS': 'hair-care',
    'HAIR CARE': 'hair-care',
    'SKIN CARE': 'skincare',
    'SKINCARE': 'skincare',
    'SERUM': 'serum-cream',
    'CREAM': 'moisture-cream',
    'ACCESSORIES': 'accessories',
  };

  // Step 4: Import each product
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const sp of shopifyProducts) {
    try {
      const handle = sp.handle;

      // Find the best category
      const productTypeUpper = (sp.product_type || '').toUpperCase();
      const categoryHandle = productTypeToCategory[productTypeUpper] || 'skincare';
      const categoryId = categoryMap[categoryHandle] || categoryMap['all'] || fallbackCat._id;

      // Primary variant
      const primaryVariant = sp.variants?.[0] || {};
      const price = parseFloat(primaryVariant.price || '0');
      const compareAtPrice = parseFloat(primaryVariant.compare_at_price || '0') || 0;
      const discount = compareAtPrice > price
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

      // Build our images array from Shopify images
      const images = (sp.images || []).map(img => ({
        url: img.src,
        altText: img.alt || sp.title,
      }));

      // If no images, skip gracefully
      if (images.length === 0 && sp.image?.src) {
        images.push({ url: sp.image.src, altText: sp.title });
      }

      // Build variants array
      const variants = sp.variants.map(v => ({
        title: v.title,
        price: parseFloat(v.price),
        compareAtPrice: parseFloat(v.compare_at_price || '0') || 0,
        sku: v.sku || '',
        available: true,
        option1: v.option1 || null,
        option2: v.option2 || null,
      }));

      // Clean description
      const description = sp.body_html ? stripHtml(sp.body_html) : sp.title;

      const productData = {
        name: sp.title,
        slug: handle,
        brand: sp.vendor || 'Beautina',
        category: categoryId,
        description,
        price,
        discount,
        countInStock: 50, // Shopify storefront doesn't expose exact stock via public API
        images,
        rating: 4.5 + Math.random() * 0.4,
        numReviews: Math.floor(Math.random() * 80) + 20,
        isFeatured: true,
        // Extra Shopify fields stored in existing schema where possible
      };

      // Idempotent upsert by slug
      const result = await Product.findOneAndUpdate(
        { slug: handle },
        { $set: productData },
        { upsert: true, new: true }
      );

      console.log(`  ✅ ${result.name} - ₹${price}`);
      imported++;

    } catch (err) {
      failed++;
      console.error(`  ❌ Failed: ${sp.title}: ${err.message}`);
    }
  }

  console.log(`\n=============================`);
  console.log(`Import Summary:`);
  console.log(`  ✅ Imported/Updated: ${imported}`);
  console.log(`  ⏭  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total in DB: ${await Product.countDocuments()}`);
  console.log(`=============================\n`);

  process.exit(0);
};

seedFromShopify().catch(err => {
  console.error(err);
  process.exit(1);
});
