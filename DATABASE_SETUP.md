# 🗄️ הגדרת מסד נתונים - Supabase

## למה Supabase?

✅ **חינמי** - עד 500MB נתונים, מספיק ל-1000+ עבודות  
✅ **קל להטמעה** - API מוכן, אין צורך ב-Backend מורכב  
✅ **PostgreSQL** - מסד נתונים חזק ומקצועי  
✅ **Real-time** - עדכונים בזמן אמת  
✅ **Authentication** - אפשר להוסיף התחברות משתמשים  
✅ **Storage** - אפשר לשמור תמונות/קבצים  

---

## 📋 שלב 1: יצירת פרויקט ב-Supabase

1. היכנס ל-[supabase.com](https://supabase.com)
2. לחץ על "Start your project"
3. היכנס עם GitHub/Google
4. צור פרויקט חדש:
   - שם: `carpenter-panel`
   - Database Password: שמור את הסיסמה!
   - Region: בחר הכי קרוב (Europe West)
5. חכה 2-3 דקות עד שהפרויקט מוכן

---

## 📋 שלב 2: הפעלת Authentication

1. היכנס ל-**Authentication** בתפריט השמאלי
2. לחץ על **Enable Email** תחת **Providers**
3. אפשר **Email** ו-**Confirm email** (אופציונלי - אם רוצה אימות אימייל)
4. שמור את ההגדרות

---

## 📋 שלב 3: יצירת טבלאות

לאחר שהפרויקט מוכן:

1. היכנס ל-**SQL Editor** בתפריט השמאלי
2. העתק והדבק את הקוד הבא:

```sql
-- טבלת עבודות
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  project_type TEXT NOT NULL,
  title TEXT NOT NULL,
  customer_name TEXT,
  width_cm INTEGER NOT NULL,
  depth_cm INTEGER NOT NULL,
  height_cm INTEGER NOT NULL,
  material TEXT NOT NULL,
  thickness_mm INTEGER NOT NULL,
  drawers INTEGER DEFAULT 0,
  doors INTEGER DEFAULT 0,
  include_back_panel BOOLEAN DEFAULT false,
  include_edge_banding BOOLEAN DEFAULT false,
  labor_hours INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת מחירון
CREATE TABLE pricing_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  panel_prices JSONB NOT NULL,
  edge_band_price DECIMAL NOT NULL,
  drawer_slides_price DECIMAL NOT NULL,
  handle_price DECIMAL NOT NULL,
  hinge_price DECIMAL NOT NULL,
  screw_box_price DECIMAL NOT NULL,
  labor_price_per_hour DECIMAL NOT NULL,
  default_profit_multiplier DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- טבלת הגדרות
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  default_material TEXT,
  default_thickness INTEGER,
  default_labor_hours INTEGER,
  waste_percentage DECIMAL DEFAULT 0.15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקסים לביצועים טובים יותר
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- RLS (Row Level Security) - הגנה על הנתונים
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- מדיניות: כל משתמש רואה רק את הנתונים שלו
CREATE POLICY "Users can view own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- אותו דבר למחירון והגדרות
CREATE POLICY "Users can manage own pricing" ON pricing_configs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);
```

3. לחץ על **Run** (או F5)

---

## 📋 שלב 4: קבלת API Keys

1. היכנס ל-**Settings** → **API**
2. העתק:
   - **Project URL** (משהו כמו: `https://xxxxx.supabase.co`)
   - **anon public key** (מפתח ארוך)

---

## 📋 שלב 5: התקנת Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## 📋 שלב 6: הגדרת משתני סביבה

צור קובץ `.env.local` בתיקיית הפרויקט:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **חשוב:** הוסף את `.env.local` ל-`.gitignore` כדי לא לשתף את המפתחות!

---

## 📋 שלב 7: התקנה על הטלפון (PWA)

האפליקציה מוכנה להתקנה על הטלפון!

### Android:
1. פתח את האפליקציה בדפדפן Chrome
2. לחץ על תפריט (3 נקודות)
3. בחר "הוסף למסך הבית" או "Install App"
4. האפליקציה תתקין ותופיע כמו אפליקציה רגילה

### iOS (iPhone/iPad):
1. פתח את האפליקציה בדפדפן Safari
2. לחץ על כפתור השיתוף (החץ למעלה)
3. בחר "הוסף למסך הבית"
4. האפליקציה תתקין ותופיע כמו אפליקציה רגילה

### יתרונות PWA:
✅ עובד גם בלי אינטרנט (offline mode)  
✅ נשמר על הטלפון  
✅ נראה כמו אפליקציה רגילה  
✅ גישה מהירה מהמסך הבית  

---

## 📋 שלב 8: שימוש בקוד

הקוד כבר מוכן! פשוט הפעל את הפרויקט והכל יעבוד.

---

## 🔄 מעבר מ-LocalStorage ל-Supabase

המערכת תומכת בשניהם:
- **אם יש Supabase** - משתמש ב-Supabase
- **אם אין** - משתמש ב-LocalStorage (fallback)

---

## 🎯 יתרונות

✅ **גיבוי אוטומטי** - כל הנתונים בענן  
✅ **גישה מכל מקום** - מכל מכשיר  
✅ **אבטחה** - רק המשתמש רואה את הנתונים שלו  
✅ **סקיילבילי** - יכול לגדול ללא בעיות  
✅ **Real-time** - עדכונים מיידיים  

---

## 💡 אפשרויות נוספות

### 1. הוספת Authentication
- משתמשים יכולים להיכנס עם Email/Password
- או עם Google/GitHub

### 2. שמירת תמונות
- העלאת תמונות של פרויקטים
- שמירה ב-Supabase Storage

### 3. שיתוף עבודות
- אפשר לשתף עבודות עם לקוחות
- קישור ציבורי (read-only)

---

## 🆘 עזרה

אם יש בעיות:
1. בדוק שה-SQL רץ בהצלחה
2. בדוק שה-API keys נכונים
3. בדוק שה-RLS מופעל
4. בדוק את ה-Console בדפדפן לשגיאות

