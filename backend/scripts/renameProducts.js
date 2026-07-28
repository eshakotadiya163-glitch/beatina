import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();
connectDB();

const realisticNames = {
  'Skin Care': [
    'Vitamin C Brightening Serum',
    'Hyaluronic Acid Hydrating Serum',
    'Retinol Night Cream',
    'Niacinamide Blemish Control',
    'Gentle Foaming Cleanser',
    'Daily Hydrating Moisturizer',
    'AHA/BHA Exfoliating Toner',
    'Soothing Aloe Vera Gel',
    'Under Eye Rescue Cream',
    'Purifying Clay Mask'
  ],
  'Hair Care': [
    'Argan Oil Hair Serum',
    'Intense Repair Shampoo',
    'Deep Nourishing Conditioner',
    'Keratin Hair Mask',
    'Scalp Exfoliating Scrub',
    'Leave-in Detangling Spray',
    'Hair Growth Tonic',
    'Volumizing Mousse',
    'Dry Shampoo',
    'Heat Protectant Spray'
  ],
  'Body Care': [
    'Shea Butter Body Lotion',
    'Exfoliating Body Scrub',
    'Nourishing Body Wash',
    'Hydrating Body Oil',
    'Hand & Foot Repair Cream',
    'Firming Body Butter',
    'Deodorant Roll-on',
    'Soothing Bath Salts'
  ],
  'Fragrance': [
    'Floral Bloom Eau De Parfum',
    'Citrus Breeze Body Mist',
    'Vanilla Amber Perfume',
    'Woody Oud Cologne',
    'Ocean Fresh Perfume Oil',
    'Rose Petal Fragrance Mist'
  ],
  'Wellness': [
    'Collagen Peptides Powder',
    'Biotin Hair Gummies',
    'Sleep Well Melatonin Tablets',
    'Detox Green Tea',
    'Multivitamin Daily Supplements'
  ],
  'Sun Care': [
    'SPF 50 PA+++ Sunscreen',
    'Tinted Mineral Sunscreen',
    'After Sun Soothing Gel',
    'Sunscreen Stick',
    'Matte Finish Sunscreen'
  ],
  'Makeup': [
    'Liquid Foundation SPF 15',
    'Volumizing Mascara',
    'Matte Liquid Lipstick',
    'Flawless Finish Concealer',
    'Cheek & Lip Tint',
    'Translucent Setting Powder',
    'Eyeshadow Palette',
    'Illuminating Highlighter'
  ]
};

const renameProducts = async () => {
  try {
    const products = await Product.find().populate('category');
    console.log(`Found ${products.length} products to check...`);

    let updatedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // Check if product name matches "Product [number]" or similar generic names
      if (/product\s*\d+/i.test(product.name)) {
        const catName = product.category ? product.category.name : 'Skin Care';
        const namesList = realisticNames[catName] || realisticNames['Skin Care'];
        
        // Pick a random realistic name from the correct category
        const randomIndex = Math.floor(Math.random() * namesList.length);
        const newName = `${namesList[randomIndex]} ${Math.floor(Math.random() * 100)}`; // add a number so slug stays somewhat unique if duplicates picked

        // Create slug
        const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        console.log(`Renaming: ${product.name} -> ${newName}`);

        product.name = newName;
        product.slug = slug;
        
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully renamed ${updatedCount} generic products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error renaming products:', error);
    process.exit(1);
  }
};

renameProducts();
