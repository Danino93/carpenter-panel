# 🎨 הגדרת אייקון לאפליקציה

## ✅ מה כבר נוצר:

1. **אייקון SVG יפה** - `public/icon.svg`
   - פטיש ומסור עם גרדיאנט ססגוני
   - אפקטי זוהר ואנימציות

2. **כלי ליצירת PNG** - `create-icons.html`
   - פתח את הקובץ בדפדפן
   - לחץ על הכפתורים להוריד את האייקונים בגדלים שונים

## 📱 הגדרת האייקון ב-Android:

### דרך 1: שימוש ב-Android Studio (המומלץ)

1. פתח את הפרויקט ב-Android Studio:
   ```bash
   npx cap open android
   ```

2. ב-Android Studio:
   - לחץ ימין על `android/app/src/main/res`
   - בחר `New` → `Image Asset`
   - בחר `Launcher Icons (Adaptive and Legacy)`
   - העלה את `public/icon.svg` או `icon-512x512.png`
   - לחץ `Next` → `Finish`

3. Android Studio ייצור את כל הגדלים אוטומטית!

### דרך 2: העתקה ידנית

אם יצרת את הקבצים דרך `create-icons.html`:

1. העתק את הקבצים לתיקיות המתאימות:
   ```
   icon-48x48.png  → android/app/src/main/res/mipmap-mdpi/ic_launcher.png
   icon-72x72.png  → android/app/src/main/res/mipmap-hdpi/ic_launcher.png
   icon-96x96.png  → android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
   icon-144x144.png → android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
   icon-192x192.png → android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
   ```

2. גם העתק ל-`ic_launcher_foreground.png` באותן תיקיות

3. גם העתק ל-`ic_launcher_round.png` (אייקון מעוגל)

## 🎨 עיצוב האייקון:

האייקון כולל:
- **גרדיאנט ססגוני**: סגול (#667eea) → סגול כהה (#764ba2) → ורוד (#f093fb)
- **פטיש**: כלי נגרות קלאסי במרכז
- **מסור**: כלי נוסף בפינה
- **אפקטי זוהר**: נקודות זוהרות סביב

## 📝 הערות:

- האייקון צריך להיות **מרובע** (1:1)
- **רקע**: הגרדיאנט הססגוני משמש כרקע
- **גודל מינימלי**: 512x512 פיקסלים
- **פורמט**: PNG עם שקיפות (אם צריך)

---

**לאחר הגדרת האייקון, המשך ל-`BUILD_APK.md` לבניית ה-APK!**

