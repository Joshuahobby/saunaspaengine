const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\[#0d1a1c\]/g, replacement: 'teal-900' },
  { regex: /\[#2a4d50\]/g, replacement: 'teal-700' },
  { regex: /\[#4b949b\]/g, replacement: 'teal-500' },
  { regex: /\[#e7f2f3\]/g, replacement: 'teal-100' },
  { regex: /\[#0fd4e6\]/g, replacement: 'primary' },
  { regex: /\[#f6f8f8\]/g, replacement: 'bg-light' },
  { regex: /\[#102022\]/g, replacement: 'bg-dark' },
  { regex: /font-newsreader/g, replacement: 'font-serif' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
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

const files = walk('src/app').concat(walk('src/components'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  replacements.forEach(r => {
    newContent = newContent.replace(r.regex, r.replacement);
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
