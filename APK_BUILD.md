# 📱 בניית APK אמיתי לאנדרואיד

## מה זה Capacitor?

Capacitor הוא כלי שממיר את האפליקציה הווב שלך ל-APK אמיתי שאפשר להעלות ל-Google Play!

## 📋 שלב 1: התקנת Capacitor

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

## 📋 שלב 2: אתחול Capacitor

```bash
npx cap init
```

כשתשאל:
- App name: `פאנל נגרות`
- App ID: `com.carpenter.panel` (או מה שתרצה)
- Web dir: `dist`

## 📋 שלב 3: בניית האפליקציה

```bash
npm run build
```

## 📋 שלב 4: הוספת פלטפורמת אנדרואיד

```bash
npx cap add android
```

## 📋 שלב 5: סנכרון הקבצים

```bash
npx cap sync
```

## 📋 שלב 6: פתיחת Android Studio

```bash
npx cap open android
```

## 📋 שלב 7: בניית APK ב-Android Studio

1. Android Studio יפתח את הפרויקט
2. לחץ על **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. חכה לסיום הבנייה
4. ה-APK יהיה ב: `android/app/build/outputs/apk/debug/app-debug.apk`

## 📋 שלב 8: התקנה על הטלפון

### דרך 1: USB
1. חבר את הטלפון למחשב
2. הפעל **USB Debugging** בטלפון
3. ב-Android Studio: **Run** → **Run 'app'**

### דרך 2: העברה ידנית
1. העתק את ה-APK לטלפון
2. פתח את הקובץ בטלפון
3. אפשר התקנה מ-"מקורות לא ידועים"
4. התקן

## 📋 שלב 9: חתימה על APK (לייצור)

להעלאה ל-Google Play צריך APK חתום:

```bash
# יצירת keystore
keytool -genkey -v -keystore carpenter-panel-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias carpenter-panel

# חתימה על APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore carpenter-panel-key.jks app-release-unsigned.apk carpenter-panel

# אופטימיזציה
zipalign -v 4 app-release-unsigned.apk carpenter-panel-release.apk
```

## ⚠️ דרישות

- **Android Studio** - צריך להתקין
- **Java JDK** - צריך להתקין
- **Android SDK** - מותקן עם Android Studio

## 💡 טיפים

1. **בדיקה בטלפון** - תמיד בדוק על טלפון אמיתי לפני פרסום
2. **אייקונים** - ודא שיש אייקונים ב-192x192 ו-512x512
3. **Permissions** - בדוק שהאפליקציה לא מבקשת הרשאות מיותרות
4. **ביצועים** - בדוק שהאפליקציה רצה חלק על הטלפון

## 🎯 העלאה ל-Google Play

1. צור חשבון מפתח ב-Google Play Console
2. תשלום חד-פעמי: $25
3. העלה את ה-APK החתום
4. מלא פרטים על האפליקציה
5. שלח לבדיקה

---

**הערה:** זה תהליך מורכב יותר מ-PWA, אבל נותן אפליקציה אמיתית!

