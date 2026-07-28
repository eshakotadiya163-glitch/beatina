const fs = require('fs');

let content = fs.readFileSync('data/products.js', 'utf8');

// The exact mappings we know from the screenshot
const mappings = {
  "Madara Product 34": "Night Cream",
  "Madara Product 31": "Vitamin Oil",
  "Madara Product 33": "Balancing Fluid",
  "Madara Product 35": "The Concealer"
};

// Also we have a list of real product names we can use for the rest
const missingNames = [
  'Sebum Control Clear Skin Wash',
  'Custom Actives',
  'Face Cream for Men',
  'After Shave Serum for Men',
  'Clarifying Toner',
  'Spot Roll-On',
  'Rich Hydra-Barrier CICA Cream',
  'Illuminating Recovery Cream',
  'Intense Glow Concentrate',
  'Hydra Moisture+Radiance Mask',
  'Hydra Repair Intensive Serum',
  'Hydra Recharge Cream',
  'Eye Revive Hydra Cream & Mask',
  'Hydra Intense Rose Jelly'
];

let nameIndex = 0;

const updatedContent = content.replace(/"name":\s*"Madara Product (\d+)"/g, (match, num) => {
  const original = `Madara Product ${num}`;
  if (mappings[original]) {
    return `"name": "${mappings[original]}"`;
  } else {
    // Pick a name from the missing names list
    const newName = missingNames[nameIndex % missingNames.length];
    nameIndex++;
    return `"name": "${newName}"`;
  }
});

fs.writeFileSync('data/products.js', updatedContent);
console.log('Successfully updated product names!');
