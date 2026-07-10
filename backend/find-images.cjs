const fs = require('fs');
const html = fs.readFileSync('beautina_real_unlocked.html', 'utf-8');

const regex = /<h6 class="ag-solid">([\s\S]*?)<\/h6>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const snippet = html.substring(match.index - 500, match.index + 100);
  console.log(snippet.substring(snippet.indexOf('<img')));
  console.log('---');
}
