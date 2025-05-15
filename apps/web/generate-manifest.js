const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const manifestPath = path.join(imagesDir, 'manifest.json');

// Read all files in the images directory
const files = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.jpg') || file.endsWith('.gif'))
  .filter(file => file !== 'manifest.json');

// Write manifest
fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));

console.log(`Manifest created with ${files.length} files`);