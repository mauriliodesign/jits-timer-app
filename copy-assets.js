import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// Copy built assets to public folder for Vercel deployment
try {
  // Create assets directory if it doesn't exist
  mkdirSync('public/assets', { recursive: true });
  
  // Copy CSS file
  copyFileSync('dist/public/assets/index-cpruR9Ei.css', 'public/assets/index-cpruR9Ei.css');
  console.log('✅ CSS file copied to public/assets/');
  
  // Copy JS file (get the actual filename from dist)
  const jsFiles = readdirSync('dist/public/assets').filter(file => file.endsWith('.js'));
  if (jsFiles.length > 0) {
    const jsFile = jsFiles[0];
    copyFileSync(`dist/public/assets/${jsFile}`, `public/assets/${jsFile}`);
    console.log(`✅ JS file copied to public/assets/${jsFile}`);
  } else {
    throw new Error('No JS file found in dist/public/assets/');
  }
  
  console.log('✅ All assets copied successfully!');
} catch (error) {
  console.error('❌ Error copying assets:', error);
  process.exit(1);
}
