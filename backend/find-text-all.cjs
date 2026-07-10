const fs = require('fs');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');

const regex = /Skin Care/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(html.substring(match.index - 50, match.index + 100).replace(/\n/g, ' '));
  console.log('---');
}
