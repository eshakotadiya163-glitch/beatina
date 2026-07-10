import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

async function compareImages() {
  const img1Path = 'C:/Users/eshak/.gemini/antigravity/brain/6187fdb0-666e-413f-9ccc-7086efe5ab29/beautina_real.png';
  const img2Path = 'E:/aura collection/frontend/localhost_full_final3.png';
  
  if (!fs.existsSync(img1Path)) throw new Error('Missing beautina_real.png');
  if (!fs.existsSync(img2Path)) throw new Error('Missing localhost_full_final3.png');

  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);
  
  console.log(`Comparing dimensions: ${width}x${height}`);

  const diff = new PNG({ width, height });
  const croppedImg1 = new PNG({width, height});
  const croppedImg2 = new PNG({width, height});
  PNG.bitblt(img1, croppedImg1, 0, 0, width, height, 0, 0);
  PNG.bitblt(img2, croppedImg2, 0, 0, width, height, 0, 0);

  let mismatches = pixelmatch(croppedImg1.data, croppedImg2.data, diff.data, width, height, { threshold: 0.1 });

  const diffPath = 'C:/Users/eshak/.gemini/antigravity/brain/6187fdb0-666e-413f-9ccc-7086efe5ab29/diff_output_final3.png';
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`Mismatched pixels: ${mismatches}`);
  console.log(`Diff saved to ${diffPath}`);
}

compareImages().catch(console.error);
