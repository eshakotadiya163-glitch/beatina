const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const frontendDir = path.join('e:', 'aura collection', 'frontend', 'src');
const files = walk(frontendDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/font-sans/g, 'font-body')
        .replace(/font-serif/g, 'font-heading')
        .replace(/text-\[\#111111\]/g, 'text-brand-dark')
        .replace(/text-gray-500/g, 'text-brand-muted')
        .replace(/bg-\[\#111111\]/g, 'bg-brand-dark')
        .replace(/border-\[\#111111\]/g, 'border-brand-dark');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log("Done");
