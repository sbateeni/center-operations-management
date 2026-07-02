إعداد Supabase وVercel لتفعيل تسجيل الدخول بجوجل

1) على لوحة Supabase
- اذهب إلى Project → Authentication → Settings → Providers
- فعّل `Google` وأضف Redirect URL:
  - `http://localhost:5173` (للتطوير المحلي، عدّل المنفذ حسب `vite`)
  - `https://<your-vercel-domain>` (للنشر على Vercel)

2) إعداد المتغيرات في Vercel
- في Dashboard > Project > Settings > Environment Variables أضف المتغيرات:
  - `VITE_SUPABASE_URL` = https://...supabase.co
  - `VITE_SUPABASE_ANON_KEY` = (anon public key)

ملاحظات أمان
- لا ترفع مفاتيح `service_role` أو كلمات المرور إلى المستودع.
- استخدم `SUPABASE_SERVICE_ROLE_KEY` فقط في جانب الخادم (Serverless functions) إن لزم.

تشغيل محلي سريع
- انسخ `.env.example` إلى `.env.development` واملأ القيم ثم:

```bash
npm install
npm run dev
```

اختبار تسجيل الدخول
- افتح التطبيق محليًا، اضغط "الدخول بحساب Google" وسيحولك Supabase إلى صفحة Google ثم يعيدك إلى `window.location.origin`.
- على Vercel، بعد إضافة المتغيرات وإعداد Redirect URL، قم بإعادة نشر المشروع.
