import { copyFileSync, mkdirSync, readdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

try {
  mkdirSync('public/assets', { recursive: true });
  copyFileSync('dist/public/assets/index-cpruR9Ei.css', 'public/assets/index-cpruR9Ei.css');
  console.log('✅ CSS file copied to public/assets/');

  const jsFiles = readdirSync('dist/public/assets').filter(file => file.endsWith('.js'));
  if (jsFiles.length > 0) {
    // Get the most recent JS file (should be the one with the latest timestamp)
    const jsFile = jsFiles[0];
    copyFileSync(`dist/public/assets/${jsFile}`, `public/assets/${jsFile}`);
    console.log(`✅ JS file copied to public/assets/${jsFile}`);
    
    // Update the HTML file to reference the correct JS file
    const htmlPath = 'public/index.html';
    let htmlContent = readFileSync(htmlPath, 'utf8');
    htmlContent = htmlContent.replace(/\/assets\/index-[A-Za-z0-9]+\.js/g, `/assets/${jsFile}`);
    writeFileSync(htmlPath, htmlContent);
    console.log(`✅ Updated HTML to reference ${jsFile}`);
  } else {
    throw new Error('No JS file found in dist/public/assets/');
  }

  console.log('✅ All assets copied successfully!');
} catch (error) {
  console.error('❌ Error copying assets:', error);
  process.exit(1);
}
