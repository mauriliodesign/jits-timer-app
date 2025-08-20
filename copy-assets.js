import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// Copy built assets to public folder for Vercel deployment
try {
  // Create assets directory if it doesn't exist
  mkdirSync('public/assets', { recursive: true });
  
  // Copy CSS file
  copyFileSync('dist/public/assets/index-cpruR9Ei.css', 'public/assets/index-cpruR9Ei.css');
  console.log('✅ CSS file copied to public/assets/');
  
  // Copy JS file
  copyFileSync('dist/public/assets/index-DcwqpY0L.js', 'public/assets/index-DcwqpY0L.js');
  console.log('✅ JS file copied to public/assets/');
  
  console.log('✅ All assets copied successfully!');
} catch (error) {
  console.error('❌ Error copying assets:', error);
  process.exit(1);
}
