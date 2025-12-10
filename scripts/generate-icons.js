const fs = require('fs');
const path = require('path');

// קרא את ה-SVG
const svgContent = fs.readFileSync(path.join(__dirname, '../public/icon.svg'), 'utf8');

// הגדר גדלים שונים
const sizes = [
  { size: 48, folder: 'mipmap-mdpi' },
  { size: 72, folder: 'mipmap-hdpi' },
  { size: 96, folder: 'mipmap-xhdpi' },
  { size: 144, folder: 'mipmap-xxhdpi' },
  { size: 192, folder: 'mipmap-xxxhdpi' },
];

// פונקציה ליצירת PNG מ-SVG (פשוטה - נשתמש ב-Canvas אם יש)
function createPNGFromSVG(size) {
  // זה דורש canvas או sharp - נשתמש בגישה פשוטה יותר
  // נשתמש ב-HTML Canvas דרך Node.js
  return new Promise((resolve, reject) => {
    try {
      // נשתמש ב-puppeteer או כלי אחר להמיר SVG ל-PNG
      // אבל כרגע נשתמש בגישה פשוטה - העתקת SVG כבסיס
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

console.log('📱 יצירת אייקונים...');
console.log('⚠️  שים לב: צריך להמיר את ה-SVG ל-PNG ידנית או דרך create-icons.html');
console.log('📁 האייקון המקור נמצא ב: public/icon.svg');
console.log('\n💡 פתרון מהיר:');
console.log('1. פתח את create-icons.html בדפדפן');
console.log('2. לחץ על כל הכפתורים להוריד את האייקונים');
console.log('3. העתק אותם לתיקיות המתאימות ב-android/app/src/main/res/');

