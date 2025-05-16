/**
 * Script to generate a manifest.json file from images in the public/images directory
 * 
 * This script reads all image files in the directory and creates a JSON file listing them
 * Run with: node scripts/generate-manifest.js
 */
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGES_DIR = path.join(__dirname, '../public/images');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Make sure the directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  console.error(`Error: Directory ${IMAGES_DIR} does not exist`);
  process.exit(1);
}

// Read all files in the directory
console.log(`Reading images from ${IMAGES_DIR}...`);
fs.readdir(IMAGES_DIR, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err.message}`);
    process.exit(1);
  }

  // Filter only image files by extension
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext) && file !== 'manifest.json';
  });

  if (imageFiles.length === 0) {
    console.warn('Warning: No image files found in the directory');
  } else {
    console.log(`Found ${imageFiles.length} image files`);
  }

  // Write the manifest file
  fs.writeFile(MANIFEST_PATH, JSON.stringify(imageFiles, null, 2), err => {
    if (err) {
      console.error(`Error writing manifest file: ${err.message}`);
      process.exit(1);
    }
    console.log(`Manifest file created successfully at ${MANIFEST_PATH}`);
  });
});
