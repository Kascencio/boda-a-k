const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/PrimeraParte.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of the overlay SVG block using regex for flexibility
// We look for <svg ... className="master-svg svg-layer-overlay" ... >
const overlayRegex = /<svg[^>]*className=["']master-svg svg-layer-overlay["'][^>]*>/;
const match = overlayRegex.exec(content);

if (!match) {
  console.log('Overlay SVG not found');
  process.exit(1);
}

const overlayStart = match.index;
const overlayEnd = content.indexOf('</svg>', overlayStart) + 6;
let overlayBlock = content.substring(overlayStart, overlayEnd);

const ids = [
  'letter_mover',
  'letter_outside',
  'clip_letter_outside',
  'clip_letter_inside',
  'flap',
  'base_flap_cover',
  'mouth_shadow',
  'clip_mouth_shadow',
  'clip_flap',
  'clip_seal'
];

ids.forEach(id => {
  // Rename ID definition: id="value"
  // React/JSX uses id="value" safely
  const idRegex = new RegExp(`id="${id}"`, 'g');
  overlayBlock = overlayBlock.replace(idRegex, `id="${id}_overlay"`);

  // Rename URL references: url(#value)
  const urlRegex = new RegExp(`url\\(#${id}\\)`, 'g');
  overlayBlock = overlayBlock.replace(urlRegex, `url(#${id}_overlay)`);

  // Rename href references: href="#value"
  const hrefRegex = new RegExp(`href="#${id}"`, 'g');
  overlayBlock = overlayBlock.replace(hrefRegex, `href="#${id}_overlay"`);
});

// Replace the block in the content
content = content.substring(0, overlayStart) + overlayBlock + content.substring(overlayEnd);

fs.writeFileSync(filePath, content);
console.log('Successfully renamed IDs in Overlay SVG.');
