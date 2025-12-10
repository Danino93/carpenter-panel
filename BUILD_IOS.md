# 📱 בניית אפליקציה ל-iOS (iPhone/iPad)

## ✅ מה כבר מוכן:
- ✅ פלטפורמת iOS נוספה
- ✅ הקבצים מסונכרנים
- ✅ האייקון והלוגו מוגדרים
- ✅ Splash Screen מוכן

## 🍎 דרישות:
- **Mac** עם macOS
- **Xcode** (מ-App Store)
- **Apple Developer Account** (חינמי לבדיקות, $99/שנה ל-App Store)

## 📱 בניית האפליקציה:

### שלב 1: פתיחת Xcode
```bash
npx cap open ios
```

### שלב 2: הגדרת Signing
1. ב-Xcode, בחר את הפרויקט `App` בצד שמאל
2. בחר את ה-Target `App`
3. לך ל-`Signing & Capabilities`
4. סמן `Automatically manage signing`
5. בחר את ה-Team שלך (או צור Apple ID חדש)

### שלב 3: בחירת מכשיר
- בחר iPhone או iPad מהרשימה למעלה
- או בחר `Any iOS Device` לבנייה כללית

### שלב 4: בנייה והרצה
1. לחץ על **▶️ Run** (או `Cmd + R`)
2. Xcode יבנה את האפליקציה
3. אם יש לך iPhone מחובר - האפליקציה תותקן עליו
4. אם לא - תוכל להריץ ב-Simulator

## 📦 יצירת IPA (להפצה):

### ל-TestFlight / App Store:
1. `Product` → `Archive`
2. חכה לסיום
3. `Distribute App`
4. בחר `App Store Connect`
5. עקוב אחר ההוראות

### ל-Ad Hoc (התקנה ישירה):
1. `Product` → `Archive`
2. `Distribute App`
3. בחר `Ad Hoc`
4. בחר מכשירים
5. הורד את ה-IPA

## 🎯 הערות:
- **Simulator** - לבדיקות מהירות (לא דורש מכשיר)
- **TestFlight** - להפצה לבדיקות (דורש Apple Developer Account)
- **App Store** - לפרסום רשמי ($99/שנה)

---

**בהצלחה! 🎉**

