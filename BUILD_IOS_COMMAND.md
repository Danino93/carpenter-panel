# 🍎 בניית IPA לאייפון דרך פקודה

## ⚠️ דרישות:
- **Mac** עם macOS (לא עובד ב-Windows!)
- **Xcode** מותקן
- **Apple Developer Account** (חינמי לבדיקות)

## 🚀 בניית IPA דרך פקודה:

### שלב 1: בניית האפליקציה
```bash
npm run build
npx cap sync
```

### שלב 2: פתיחת Xcode (חד פעמי - להגדרת Signing)
```bash
npx cap open ios
```

ב-Xcode:
1. בחר את הפרויקט `App`
2. לך ל-`Signing & Capabilities`
3. סמן `Automatically manage signing`
4. בחר Team

### שלב 3: בניית IPA דרך פקודה

**ל-Simulator (לבדיקות):**
```bash
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15' build
```

**ל-Device (IPA אמיתי):**
```bash
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath build/App.xcarchive archive
xcodebuild -exportArchive -archivePath build/App.xcarchive -exportPath build/ipa -exportOptionsPlist ExportOptions.plist
```

ה-IPA יהיה ב: `ios/App/build/ipa/App.ipa`

---

## ⚠️ בעיה: Windows

**אם אתה ב-Windows:**
- ❌ לא ניתן לבנות IPA ב-Windows
- ✅ צריך Mac או Mac בשרת (CI/CD)
- ✅ או להשתמש ב-Cloud Build (AppCircle, Codemagic)

---

## 💡 פתרונות חלופיים:

### 1. PWA (עובד גם על אייפון!)
- פתח את האפליקציה ב-Safari
- לחץ "שתף" → "הוסף למסך הבית"
- זה יוצר אפליקציה על האייפון!

### 2. TestFlight (אם יש לך Mac)
- בנה ב-Mac
- העלה ל-TestFlight
- התקן על האייפון דרך TestFlight

### 3. Cloud Build
- AppCircle.io
- Codemagic.io
- Bitrise.io

---

**לצערי, ב-Windows לא ניתן לבנות IPA ישירות. צריך Mac או Cloud Build.**

