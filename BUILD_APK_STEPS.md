# 🚀 בניית APK - הוראות שלב אחר שלב

## ✅ מה כבר מוכן:
- ✅ האפליקציה נבנתה (`npm run build`)
- ✅ הקבצים מסונכרנים (`npx cap sync`)
- ✅ האייקון הוגדר
- ✅ הכל מוכן!

## 📱 בניית APK - הוראות:

### שלב 1: פתיחת Android Studio

הרץ את הפקודה הבאה:
```bash
npx cap open android
```

Android Studio יפתח את הפרויקט.

---

### שלב 2: המתן לסינכרון

- Android Studio יתחיל סינכרון Gradle
- חכה שהסינכרון יסתיים (2-5 דקות בפעם הראשונה)
- אם יש שגיאות - בדוק שיש לך Android SDK מותקן

---

### שלב 3: בניית ה-APK

1. **לחץ על `Build` בתפריט העליון**
2. **בחר `Build Bundle(s) / APK(s)`**
3. **בחר `Build APK(s)`**
4. **חכה לסיום הבנייה** (2-5 דקות)

---

### שלב 4: מציאת ה-APK

כשהבנייה מסתיימת:

1. תראה הודעה: **"APK(s) generated successfully"**
2. לחץ על **"locate"** או לך ידנית ל:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

### שלב 5: התקנה על הטלפון

**אפשרות 1: USB (הכי קל)**
1. חבר את הטלפון למחשב עם כבל USB
2. הפעל **USB Debugging** בטלפון:
   - הגדרות → אודות הטלפון → לחץ 7 פעמים על "מספר הבנייה"
   - חזור → אפשרויות מפתח → הפעל "דיבוג USB"
3. ב-Android Studio: לחץ על **Run** (▶️) או `Shift + F10`
4. בחר את הטלפון שלך
5. האפליקציה תותקן אוטומטית!

**אפשרות 2: העברה ידנית**
1. העתק את הקובץ `app-debug.apk` לטלפון (דרך USB, אימייל, Google Drive, וכו')
2. בטלפון: פתח את הקובץ
3. אם צריך: אפשר התקנה מ-"מקורות לא ידועים"
4. לחץ "התקן"

---

## 🆘 בעיות נפוצות:

### "SDK location not found"
**פתרון:**
1. התקן Android Studio (אם עדיין לא)
2. ב-Android Studio: `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. העתק את הנתיב (לדוגמה: `C:\Users\YourName\AppData\Local\Android\Sdk`)
4. צור קובץ `android/local.properties` עם התוכן:
   ```
   sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
   ```
   (החלף את הנתיב לנתיב שלך)

### "Gradle sync failed"
**פתרון:**
- לחץ על `File` → `Sync Project with Gradle Files`
- או לחץ על כפתור הסינכרון בפינה הימנית העליונה

### "Build failed"
**פתרון:**
- בדוק שיש לך Java JDK מותקן
- ב-Android Studio: `File` → `Project Structure` → `SDK Location` → בדוק את נתיב ה-JDK

---

## 📝 הערות:

- **זמן בנייה:** 2-5 דקות (תלוי במחשב)
- **גודל APK:** כ-5-10 MB
- **מיקום APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **אייקון:** האייקון החדש (פטיש ומסור) כבר מוגדר!

---

## 🎯 סיכום מהיר:

```bash
# 1. פתח Android Studio
npx cap open android

# 2. ב-Android Studio:
#    Build → Build Bundle(s) / APK(s) → Build APK(s)

# 3. ה-APK יהיה ב:
#    android/app/build/outputs/apk/debug/app-debug.apk
```

---

**בהצלחה! 🎉**

