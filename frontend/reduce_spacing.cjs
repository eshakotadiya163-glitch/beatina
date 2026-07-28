const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.match(/\.(tsx|jsx|ts|js|html)$/)) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('e:\\aura collection\\frontend\\src');
let changed = 0;

const map = {
  '32': '24', // 8rem -> 6rem (25% reduction)
  '28': '20', // 7rem -> 5rem (~28% reduction)
  '24': '16', // 6rem -> 4rem (~33% reduction)
  '20': '14', // 5rem -> 3.5rem (30% reduction)
  '16': '12', // 4rem -> 3rem (25% reduction)
};

const regex = /\b(py|my|pt|pb|mt|mb|gap)-(32|28|24|20|16)\b/g;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(regex, (match, prefix, val) => {
    return `${prefix}-${map[val]}`;
  });

  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    changed++;
  }
});

console.log('Changed ' + changed + ' files.');
