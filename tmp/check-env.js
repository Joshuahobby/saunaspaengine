const fs = require('fs');
const content = fs.readFileSync('f:/Joe/GetRwanda/2026/Sauna SPA Stitch V1/sauna-spa-engine/.env', 'utf8');
const lines = content.split('\n');
const dbLine = lines.find(l => l.startsWith('DATABASE_URL='));

if (dbLine) {
  const value = dbLine.split('=')[1].trim();
  console.log('Value:', value);
  console.log('Length:', value.length);
  let codes = [];
  for (let i = 0; i < value.length; i++) {
    codes.push(value.charCodeAt(i));
  }
  console.log('Codes:', codes.join(','));
} else {
  console.log('DATABASE_URL not found');
}
