import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const urls = [
  'https://beautina-cosmetic.myshopify.com/products/superseed-age-recovery-organic-facial-oil.json',
  'https://beautina-cosmetic.myshopify.com/products/3-step-hair-care-routine-set.json',
  'https://beautina-cosmetic.myshopify.com/products/peel-brightening-5-aha-peel-mask.json',
  'https://beautina-cosmetic.myshopify.com/products/his-face-cream-for-men.json',
  'https://beautina-cosmetic.myshopify.com/products/sos-hydra-intense-rose-jelly.json',
  'https://beautina-cosmetic.myshopify.com/products/deep-moisture-day-cream.json',
  'https://beautina-cosmetic.myshopify.com/products/luminous-perfecting-concealer.json',
  'https://beautina-cosmetic.myshopify.com/products/vitamin-c-intense-glow-concentrate.json',
  'https://beautina-cosmetic.myshopify.com/products/acne-spot-roll-on.json',
  'https://beautina-cosmetic.myshopify.com/products/scalp-peel-serum.json',
  'https://beautina-cosmetic.myshopify.com/products/deep-moisture-balancing-fluid.json',
  'https://beautina-cosmetic.myshopify.com/products/boost-3-min-growth-boost-scalp-treatment.json',
  'https://beautina-cosmetic.myshopify.com/products/deep-moisture-nourish-cream-for-face.json'
];

const seedBeautina = async () => {
  try {
    await connectDB();
    
    // Ensure we have a default category
    let defaultCategory = await Category.findOne({ slug: 'skin-care' });
    if (!defaultCategory) {
      defaultCategory = await Category.create({ name: 'Skin Care', slug: 'skin-care', description: 'Skin care category' });
    }

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    const productsData = [
      { slug: 'superseed-age-recovery-organic-facial-oil', name: 'Superseed Age Recovery Organic Facial Oil', price: 1200, cat: 'Skin Care', img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80' },
      { slug: '3-step-hair-care-routine-set', name: '3-Step Hair Care Routine Set', price: 2500, cat: 'Hair Care', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80' },
      { slug: 'peel-brightening-5-aha-peel-mask', name: 'Peel Brightening 5% AHA Peel Mask', price: 950, cat: 'Face Care', img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=600&q=80' },
      { slug: 'his-face-cream-for-men', name: 'His Face Cream For Men', price: 850, cat: 'Skin Care', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80' },
      { slug: 'sos-hydra-intense-rose-jelly', name: 'SOS Hydra Intense Rose Jelly', price: 1400, cat: 'Face Care', img: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=600&q=80' },
      { slug: 'deep-moisture-day-cream', name: 'Deep Moisture Day Cream', price: 1100, cat: 'Face Care', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80' },
      { slug: 'luminous-perfecting-concealer', name: 'Luminous Perfecting Concealer', price: 650, cat: 'Makeup', img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=600&q=80' },
      { slug: 'vitamin-c-intense-glow-concentrate', name: 'Vitamin C Intense Glow Concentrate', price: 1550, cat: 'Skin Care', img: 'https://images.unsplash.com/photo-1611078713063-ce20412674fa?auto=format&fit=crop&w=600&q=80' },
      { slug: 'acne-spot-roll-on', name: 'Acne Spot Roll-on', price: 450, cat: 'Skin Care', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80' },
      { slug: 'scalp-peel-serum', name: 'Scalp Peel Serum', price: 1250, cat: 'Hair Care', img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80' },
      { slug: 'deep-moisture-balancing-fluid', name: 'Deep Moisture Balancing Fluid', price: 950, cat: 'Face Care', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80' },
      { slug: 'boost-3-min-growth-boost-scalp-treatment', name: 'Boost 3-Min Growth Boost Scalp Treatment', price: 1800, cat: 'Hair Care', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80' },
      { slug: 'deep-moisture-nourish-cream-for-face', name: 'Deep Moisture Nourish Cream For Face', price: 1300, cat: 'Face Care', img: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?auto=format&fit=crop&w=600&q=80' }
    ];

    for (const prod of productsData) {
      try {
        const exists = await Product.findOne({ slug: prod.slug });
        if (exists) {
          console.log(`Skipped existing product: ${prod.name}`);
          skipped++;
          continue;
        }

        // Get or Create Category
        const catSlug = prod.cat.toLowerCase().replace(' ', '-');
        let category = await Category.findOne({ slug: catSlug });
        if (!category) {
          category = await Category.create({ name: prod.cat, slug: catSlug, description: `${prod.cat} category` });
        }

        const newProduct = {
          name: prod.name,
          slug: prod.slug,
          brand: 'Beautina',
          category: category._id,
          description: `Luxury ${prod.name} formulated with organic, highly effective ingredients to help your skin stay resilient.`,
          price: prod.price,
          discount: Math.random() > 0.5 ? 15 : 0,
          countInStock: 50,
          images: [{ url: prod.img, altText: prod.name }],
          rating: 4.5 + Math.random() * 0.5, // 4.5 to 5.0
          numReviews: Math.floor(Math.random() * 100) + 10,
          isFeatured: true
        };

        await Product.create(newProduct);
        console.log(`Imported: ${prod.name}`);
        imported++;

      } catch (err) {
        failed++;
        console.error(`Failed to process ${prod.name}:`, err.message);
      }
    }

    console.log(`\nImport Summary:`);
    console.log(`Imported: ${imported}`);
    console.log(`Skipped (already exists): ${skipped}`);
    console.log(`Failed: ${failed}`);

    process.exit();
  } catch (error) {
    console.error(`Error in seed script: ${error.message}`);
    process.exit(1);
  }
};

seedBeautina();
