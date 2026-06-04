# تقرير مراجعة وخطة تطوير — نظام غرفة العمليات الجغرافية

## ملخص المراجعة

المشروع **متين معمارياً** ومبني بشكل احترافي — هيكلية الملفات منظمة، الأنماط التصميمية (Hooks, Components, Services) مفصولة بوضوح، ونظام الصلاحيات شامل. لكن هناك **4 محاور للتطوير** تتراوح بين مشاكل لغوية وتحسينات في التجربة المرئية.

---

## المحور الأول: توحيد اللغة العربية (أولوية عالية ⚡)

> [!WARNING]
> صفحة "الموافقة المعلقة" (`PendingApproval.tsx`) تستخدم نصوصاً إنجليزية بالكامل، وهذا يكسر الاتساق مع بقية التطبيق العربي.

### التغييرات المطلوبة

#### [MODIFY] [PendingApproval.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/PendingApproval.tsx)
- **السطر 57**: `'Account Not Found' → 'لم يتم العثور على الحساب'`
- **السطر 57**: `'Account Pending' → 'الحساب قيد المراجعة'`
- **السطور 69-80**: ترجمة جميع النصوص الإنجليزية (الشرح، التنبيهات) إلى العربية
- **السطر 91**: `'Verifying...' → 'جاري التحقق...'` و `'Check Status Again' → 'التحقق مرة أخرى'`
- **السطر 101**: `'Sign Out & Restart' → 'تسجيل الخروج وإعادة البدء'` و `'Sign Out' → 'تسجيل الخروج'`

---

## المحور الثاني: تحسينات التصميم المرئي (UI Enhancements)

### 1. صفحة تسجيل الدخول — إضافة حيوية بصرية

#### [MODIFY] [AuthPage.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/AuthPage.tsx)
- إضافة **تأثير توهج متحرك** (animated glow pulse) للخلفية بدلاً من التوهج الثابت
- إضافة **عنوان فرعي** بتاريخ/وقت النظام الحالي (لمسة تكتيكية)
- تفعيل **تأثير focus** على حقول الإدخال (حدود زرقاء متوهجة عند الكتابة)
- إضافة **تأثير hover** على زر الدخول (`transform: scale(1.02)`, `box-shadow glow`)

### 2. شاشة التحميل — إضافة شريط تقدم وهمي

#### [MODIFY] [LoadingScreen.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/layout/LoadingScreen.tsx)
- إضافة **شريط تقدم تحريكي** (animated progress bar) أسفل النص
- إضافة رسائل متبدلة (مثل: "تأمين القنوات..." → "ربط الأقمار الصناعية..." → "جاري تهيئة الخريطة...")
- إضافة **timestamp حي** يعطي طابع عسكري

### 3. لوحة البيانات الاستراتيجية — تحسين تأثير Glassmorphism

#### [MODIFY] [StrategicDashboard.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/StrategicDashboard.tsx)
- إضافة **تأثير عد تصاعدي** (counter animation) للأرقام عند ظهورها بدلاً من عرضها فوراً
- تحسين **CSS مؤثر السكانلاين** (`glass-panel::after`) المُعطّل حالياً بسبب `overflow-hidden` — إزالة `overflow-hidden` أو تعديل الـ pseudo-element

### 4. تحسين الأيقونة والخط (SEO + Branding)

#### [MODIFY] [index.html](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/index.html)
- إضافة **meta description** للـ SEO
- إضافة **favicon** (أيقونة الدرع 🛡️)
- إضافة **خط عربي احترافي** من Google Fonts (مثل `Tajawal` أو `Cairo`)
- إضافة **Open Graph tags** لمظهر احترافي عند مشاركة الرابط

---

## المحور الثالث: تحسينات الكود والتجربة (UX & Code Quality)

### 1. تحسين CSS — إضافة أنيميشن عسكري للعناصر

#### [MODIFY] [index.css](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/index.css)
- إضافة `@keyframes` جديدة: `fadeSlideUp`, `countUp`, `borderGlow`
- إضافة **utility classes** لإعادة الاستخدام: `.animate-fade-up`, `.animate-border-glow`
- تحسين `glass-panel` بإضافة `transition` سلسة
- إضافة **tooltip styling** موحد

### 2. زر SOS — إضافة تأكيد أمان

#### [MODIFY] [SOSButton.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/SOSButton.tsx)
- إضافة **نافذة تأكيد** (confirmation dialog) قبل تفعيل SOS لمنع التفعيل الخاطئ
- إضافة **عد تنازلي 3 ثوانٍ** (3s countdown) مع إمكانية الإلغاء قبل البث

### 3. شريط العمليات — تحريك تلقائي

#### [MODIFY] [OperationsLog.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/components/OperationsLog.tsx)
- إضافة **تمرير أفقي تلقائي** (auto-scrolling marquee) للسجلات عندما تكون كثيرة
- إضافة **تأثير وميض** (flash) للسجل الجديد عند وصوله (highlight لمدة ثانيتين)

---

## المحور الرابع: تحسينات وظيفية (Feature Improvements)

### 1. إغلاق تلقائي لجلسة المصدر

> [!IMPORTANT]
> حالياً جلسة المصدر المؤقت (`SourceSession`) لا تنتهي تلقائياً عند انتهاء الوقت.

#### [MODIFY] [App.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/App.tsx)
- إضافة `useEffect` يفحص `sourceSession.expiresAt` ويغلق الجلسة تلقائياً
- عرض **عداد وقت** (countdown timer) في واجهة المصدر

### 2. الإعلان عن حملة نشطة

#### [MODIFY] [App.tsx](file:///c:/Users/HP/Documents/GitHub/Gemini-house-Navigator/App.tsx)
- عند وجود `activeCampaign`، عرض **شريط علوي** (banner) بلون ذهبي يعرض اسم الحملة وعدد القوة
- هذا الشريط موجود ضمنياً في `MapControls` (`hasActiveCampaign`) لكن لا يُعرض فعلياً

---

## أسئلة مفتوحة

> [!IMPORTANT]
> **1. أي محاور ترغب بتنفيذها؟** يمكنني تنفيذ الكل أو التركيز على محاور محددة.

> **2. هل تريد إضافة خط عربي معين؟** أقترح `Tajawal` (خفيف، عسكري) أو `Cairo` (رسمي).

> **3. هل تريد تغيير ألوان التصميم الحالية؟** الألوان الحالية (كحلي/أزرق) ممتازة، لكن يمكن إضافة تدرجات ذهبية أكثر لطابع عسكري.

---

## خطة التحقق

### اختبار آلي
- `npm run build` — التأكد من عدم وجود أخطاء ترجمة TypeScript
- `npm test` — تشغيل الاختبارات الموجودة
- مراجعة المتصفح على `localhost:5173` بعد كل تعديل

### تحقق يدوي
- فحص صفحة تسجيل الدخول (الأنيميشن، التأثيرات)
- فحص صفحة الانتظار (النصوص العربية)
- فحص شاشة التحميل (الشريط المتحرك)
- فحص لوحة البيانات الاستراتيجية (تأثير الأرقام)
