#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 }
];

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const androidResPath = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
  console.log('🎨 Generating app icons from SVG...');

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error('❌ Source icon not found at public/icon.svg');
    process.exit(1);
  }

  // Create directories and generate icons
  for (const { name, size } of sizes) {
    const dir = path.join(androidResPath, `mipmap-${name}`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const outputPath = path.join(dir, 'ic_launcher.png');
    const outputPathRound = path.join(dir, 'ic_launcher_round.png');

    try {
      // Generate regular icon
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      // Generate round icon (same as regular for now)
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPathRound);

      console.log(`✅ Generated ${size}x${size} icon for ${name}`);
    } catch (error) {
      console.error(`❌ Error generating ${name} icon:`, error.message);
      process.exit(1);
    }
  }

  // Copy SVG as foreground for adaptive icon
  const drawableDir = path.join(androidResPath, 'drawable');
  if (!fs.existsSync(drawableDir)) {
    fs.mkdirSync(drawableDir, { recursive: true });
  }

  const foregroundPath = path.join(drawableDir, 'ic_launcher_foreground.svg');
  fs.copyFileSync(svgPath, foregroundPath);
  console.log('✅ Copied SVG as adaptive icon foreground');

  // Create background XML
  const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#0f0f1e"/>
</shape>`;

  fs.writeFileSync(path.join(drawableDir, 'ic_launcher_background.xml'), backgroundXml);
  console.log('✅ Created adaptive icon background');

  // Create adaptive icon configuration
  const anydpiDir = path.join(androidResPath, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiDir)) {
    fs.mkdirSync(anydpiDir, { recursive: true });
  }

  const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>`;

  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveIconXml);
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveIconXml);
  console.log('✅ Created adaptive icon configuration');

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
