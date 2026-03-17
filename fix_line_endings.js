const fs = require('fs');
const content = fs.readFileSync('prisma/schema.prisma', 'utf8');
const lfContent = content.replace(/\r\n/g, '\n');
fs.writeFileSync('prisma/schema.prisma', lfContent, 'utf8');
console.log('Converted schema.prisma to LF');
