const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 יצירת אייקונים מ-SVG...\n');

const svgPath = path.join(__dirname, '../public/icon.svg');
const publicDir = path.join(__dirname, '../public');

// בדוק אם קיים SVG
if (!fs.existsSync(svgPath)) {
  console.log('❌ לא נמצא קובץ SVG ב-public/icon.svg');
  process.exit(1);
}

// הגדר גדלים שונים
const sizes = [48, 72, 96, 144, 192, 512];

async function createIcons() {
  console.log('📱 יוצר אייקונים בגדלים שונים...\n');
  
  for (const size of sizes) {
    try {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ נוצר: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ שגיאה ביצירת ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n✅ כל האייקונים נוצרו בהצלחה!');
  console.log('💡 עכשיו תוכל להריץ: node scripts/copy-icons.js');
}

createIcons().catch(console.error);

