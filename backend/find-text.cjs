const fs = require('fs');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');

// Find index of "Skin Care"
const idx = html.indexOf('Skin Care');
if (idx > -1) {
  console.log(html.substring(idx - 200, idx + 200));
}
