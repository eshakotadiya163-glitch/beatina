const fs = require('fs');
const path = require('path');

const dirsToSearch = [
  'E:\\aura collection',
  'C:\\Users\\eshak\\.gemini\\antigravity'
];

const ignoreDirs = ['node_modules', '.git', 'dist', 'build'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4'];

let foundImages = [];

function searchDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (ignoreDirs.includes(file)) continue;
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          searchDir(fullPath);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (allowedExts.includes(ext)) {
            foundImages.push({ name: file, path: fullPath, size: stat.size });
          }
        }
      } catch (e) {}
    }
  } catch (e) {}
}

dirsToSearch.forEach(searchDir);

// Filter out already processed assets in public/assets to see what's NEW
const newImages = foundImages.filter(img => !img.path.replace(/\\/g, '/').includes('/frontend/public/assets/'));

console.log(`Total new images found: ${newImages.length}`);
console.log('Sample of found files:');
console.log(newImages.slice(0, 50).map(i => `${i.name} (${i.path})`).join('\n'));
