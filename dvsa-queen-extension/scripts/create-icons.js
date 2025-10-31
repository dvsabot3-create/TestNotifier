const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Icon sizes required for Chrome extension
const iconSizes = [16, 32, 48, 128];

// Source logos to process
const sourceLogos = [
  {
    name: 'professional',
    source: 'icons/professional-logo.png',
    description: 'Professional version with full logo'
  },
  {
    name: 'simple',
    source: 'icons/simple-logo.png',
    description: 'Simple clean version'
  }
];

console.log('🎨 Creating professional extension icons...');

// Process each source logo
sourceLogos.forEach(logo => {
  console.log(`\n📸 Processing ${logo.name} logo: ${logo.description}`);

  // Check if source file exists
  if (!fs.existsSync(logo.source)) {
    console.log(`⚠️  Source file not found: ${logo.source}`);
    return;
  }

  // Create icons directory for this logo version
  const outputDir = `icons/${logo.name}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate icons for each required size
  iconSizes.forEach(size => {
    const outputPath = path.join(outputDir, `icon${size}.png`);

    sharp(logo.source)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ Created ${outputPath}`);
      })
      .catch(err => {
        console.error(`❌ Error creating ${outputPath}:`, err);
      });
  });
});

console.log('\n🎉 Icon creation complete!');
console.log('\n📁 Generated icon sets:');
console.log('- icons/professional/ (using tn-logov2.png)');
console.log('- icons/simple/ (using tn.png)');
console.log('\n🔄 Next steps:');
console.log('1. Update manifest.json to use new icon paths');
console.log('2. Update extension UI to include logo');
console.log('3. Test both versions to see which looks better');
