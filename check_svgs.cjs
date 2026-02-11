const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/components/PrimeraParte.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const regex = /<svg[^>]*>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found SVG at index ${match.index}: ${match[0]}`);
}

console.log('Total file length:', content.length);
