import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const img1Path = 'C:/Users/eshak/.gemini/antigravity/brain/6187fdb0-666e-413f-9ccc-7086efe5ab29/beautina_real.png';
const img2Path = 'E:/aura collection/frontend/localhost_full_final4.png';

const img1 = PNG.sync.read(fs.readFileSync(img1Path));
const img2 = PNG.sync.read(fs.readFileSync(img2Path));
const width = 1440;

function compare(y, h, name) {
  const diff = new PNG({width, height: h});
  const crop1 = new PNG({width, height: h});
  const crop2 = new PNG({width, height: h});
  
  PNG.bitblt(img1, crop1, 0, y, width, h, 0, 0);
  PNG.bitblt(img2, crop2, 0, y, width, h, 0, 0);
  
  const m = pixelmatch(crop1.data, crop2.data, diff.data, width, h, {threshold: 0.1});
  console.log(`${name}|${m}|${(m / (width * h) * 100).toFixed(2)}%`);
  PNG.sync.write(diff, fs.createWriteStream(`diff_${name}.png`));
  PNG.sync.write(crop1, fs.createWriteStream(`crop1_${name}.png`));
  PNG.sync.write(crop2, fs.createWriteStream(`crop2_${name}.png`));
}

compare(0, 42, 'Announcement');
compare(42, 80, 'Header');
compare(122, 650, 'Hero');
compare(772, 800, 'Section4');
compare(1572, 800, 'Section5');
compare(2372, 800, 'Section6');
compare(3172, 800, 'Section7');
