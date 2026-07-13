const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('E:\\aura collection\\frontend\\src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace $ followed by numbers (e.g. $100)
    content = content.replace(/\$([0-9]+)/g, '₹$1');
    // Replace $${...} with ₹${...}
    content = content.replace(/\$\$\{/g, '₹${');
    // Replace $ followed by space and numbers
    content = content.replace(/\$ ([0-9]+)/g, '₹ $1');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log(`Replaced currency symbols in ${changedFiles} files.`);
