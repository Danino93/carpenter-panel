const fs = require('fs');
const path = require('path');

console.log('📱 העתקת אייקונים...\n');

// בדוק אם יש אייקונים בתיקייה public
const publicDir = path.join(__dirname, '../public');
const iconFiles = fs.readdirSync(publicDir).filter(f => f.startsWith('icon-') && f.endsWith('.png'));

if (iconFiles.length === 0) {
  console.log('❌ לא נמצאו קבצי אייקונים ב-public/');
  console.log('💡 פתח את create-icons.html בדפדפן והורד את האייקונים קודם!\n');
  process.exit(1);
}

console.log(`✅ נמצאו ${iconFiles.length} אייקונים:`);
iconFiles.forEach(f => console.log(`   - ${f}`));
console.log('');

// מיפוי גדלים לתיקיות
const sizeMap = {
  48: 'mipmap-mdpi',
  72: 'mipmap-hdpi',
  96: 'mipmap-xhdpi',
  144: 'mipmap-xxhdpi',
  192: 'mipmap-xxxhdpi',
};

const androidResDir = path.join(__dirname, '../android/app/src/main/res');

// העתק כל אייקון
iconFiles.forEach(iconFile => {
  const sizeMatch = iconFile.match(/icon-(\d+)x\d+\.png/);
  if (!sizeMatch) return;
  
  const size = parseInt(sizeMatch[1]);
  const folder = sizeMap[size];
  
  if (!folder) {
    console.log(`⚠️  גודל לא מוכר: ${size}px`);
    return;
  }
  
  const targetDir = path.join(androidResDir, folder);
  const sourceFile = path.join(publicDir, iconFile);
  
  if (!fs.existsSync(targetDir)) {
    console.log(`❌ תיקייה לא קיימת: ${targetDir}`);
    return;
  }
  
  // העתק כ-ic_launcher.png
  const targetFile = path.join(targetDir, 'ic_launcher.png');
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`✅ העתק: ${iconFile} → ${folder}/ic_launcher.png`);
  
  // גם העתק כ-ic_launcher_foreground.png (לאדפטיב אייקון)
  const targetForeground = path.join(targetDir, 'ic_launcher_foreground.png');
  fs.copyFileSync(sourceFile, targetForeground);
  console.log(`✅ העתק: ${iconFile} → ${folder}/ic_launcher_foreground.png`);
  
  // גם העתק כ-ic_launcher_round.png (אייקון מעוגל)
  const targetRound = path.join(targetDir, 'ic_launcher_round.png');
  fs.copyFileSync(sourceFile, targetRound);
  console.log(`✅ העתק: ${iconFile} → ${folder}/ic_launcher_round.png`);
});

console.log('\n✅ סיום! האייקונים הועתקו בהצלחה.');
console.log('💡 עכשיו תוכל לבנות את ה-APK עם האייקון החדש!');

