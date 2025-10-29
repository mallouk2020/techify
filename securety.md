أنت محلل أمني آلي. مهمتك فحص مشروع ويب (متجر إلكتروني مفتوح المصدر) فحصاً شاملاً بدون تعديل أي ملف.

## نظرة عامة على الفحص
- تم إجراء مراجعة لتاريخ Git لاكتشاف أي تسريبات للأسرار.
- جرى تحليل للكود بحثًا عن الاتصالات الخارجية، الدوال الخطيرة، وسيناريوهات CI/CD المشبوهة.
- نُفِّذت فحوصات `npm audit --omit=dev` في الجذر والخادم.
- تم البحث عن مفاتيح أو بيانات حساسة مكشوفة ضمن الملفات.
- جرى تقييم التبعيات والحزم لرصد سلوكيات مشبوهة أو اتصالات خارجية.
- تم التأكد من عدم وجود ملفات تنفيذية مشبوهة أو كود مضغوط بغرض الإخفاء.

## ملخص عربي لأهم النتائج
- **تسريب أسرار عالي الخطورة**: ملفات `.env`, `.env.local`, `server/.env` تحتوي على `DATABASE_URL` مع كلمة مرور PostgreSQL حقيقية، و`NEXTAUTH_SECRET`، إضافة إلى مفاتيح Cloudinary (`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). هذه الملفات موجودة في المستودع وتحتوي على أسرار فعلية، ما يعرض الحسابات للاختراق.
- **اعتماد واجهات HTTP ثابتة**: الكود يعتمد على متغير البيئة `NEXT_PUBLIC_API_BASE_URL` مع fallback إلى `http://localhost:3001` في حال عدم التعيين، ولا توجد اتصالات مشبوهة إضافية.
- **عدم وجود دوال خطيرة**: لم يتم العثور على استخدامات لـ `eval`, `new Function`, أو استدعاءات أوامر نظام.
- **أمن التبعيات**: تقارير `npm audit` للجذر وللمجلد `server/` لم تكشف عن ثغرات معروفة.
- **عدم العثور على سكربتات CI/CD ضارة**: ملف CI الوحيد `.github/workflows/blank1.yml` بسيط ولا يحتوي على أوامر خطرة.
- **استقرار الوحدات**: لم يتم رصد ملفات تنفيذية أو كود مشفّر/مضغوط بغرض الإخفاء.

## تقرير JSON مفصل
```json
{
  "findings": [
    {
      "id": "secret_database_url_root",
      "type": "Hardcoded Secret",
      "file": ".env",
      "line": 4,
      "severity": "High",
      "details": "ملف .env في الجذر يحتوي على DATABASE_URL مع بيانات اعتماد PostgreSQL فعلية.",
      "recommendation": "إزالة بيانات الاعتماد من المستودع، تدوير كلمات المرور، واستخدام مخازن أسرار آمنة." 
    },
    {
      "id": "secret_nextauth_root",
      "type": "Hardcoded Secret",
      "file": ".env",
      "line": 2,
      "severity": "High",
      "details": "ملف .env يتضمن NEXTAUTH_SECRET فعليًا ضمن المستودع.",
      "recommendation": "قم بتغيير السر فورًا، واعتمد إدارة أسرار خارجية." 
    },
    {
      "id": "secret_database_url_local",
      "type": "Hardcoded Secret",
      "file": ".env.local",
      "line": 10,
      "severity": "High",
      "details": "ملف .env.local يحتوي على DATABASE_URL مع بيانات اعتماد قاعدة البيانات الإنتاجية.",
      "recommendation": "سحب الملف من المستودع، تدوير كلمة مرور قاعدة البيانات، واستخدام إعدادات محلية منفصلة." 
    },
    {
      "id": "secret_nextauth_local",
      "type": "Hardcoded Secret",
      "file": ".env.local",
      "line": 3,
      "severity": "High",
      "details": "ملف .env.local يحتوي على NEXTAUTH_SECRET مكشوفًا.",
      "recommendation": "استبدل السر وإدارته من خلال مخزن أسرار آمن." 
    },
    {
      "id": "secret_database_url_server",
      "type": "Hardcoded Secret",
      "file": "server/.env",
      "line": 2,
      "severity": "High",
      "details": "ملف server/.env يحتوي على DATABASE_URL مع كلمة مرور PostgreSQL حقيقية.",
      "recommendation": "نقل الملف خارج المستودع، تدوير كلمات المرور، واستخدام متغيرات بيئة آمنة في البنية التحتية." 
    },
    {
      "id": "secret_cloudinary_key",
      "type": "Hardcoded Secret",
      "file": "server/.env",
      "line": 6,
      "severity": "High",
      "details": "ملف server/.env يتضمن Cloudinary API Key/Secret مكشوفة.",
      "recommendation": "إبطال المفاتيح فورًا، وإعادة إنشائها مع تخزينها خارج المستودع." 
    },
    {
      "id": "secret_cloudinary_secret",
      "type": "Hardcoded Secret",
      "file": "server/.env",
      "line": 7,
      "severity": "High",
      "details": "Cloudinary API Secret مخزّن نصيًا في المستودع.",
      "recommendation": "إبطال السر، حذف الملف من المستودع، والاعتماد على إدارة أسرار آمنة." 
    }
  ],
  "dependency_audit": {
    "root": {
      "command": "npm audit --omit=dev",
      "vulnerabilities": 0
    },
    "server": {
      "command": "npm audit --production",
      "vulnerabilities": 0
    }
  },
  "code_review": {
    "dangerous_functions": [],
    "external_connections": [
      {
        "file": "lib/api.ts",
        "line": 67,
        "description": "استخدام fetch مع قاعدة URL تعتمد على متغير البيئة NEXT_PUBLIC_API_BASE_URL."
      },
      {
        "file": "lib/config.ts",
        "line": 2,
        "description": "تهيئة عنوان API أساسي من المتغير NEXT_PUBLIC_API_BASE_URL مع fallback محلي."
      }
    ],
    "ci_cd_scripts": [
      {
        "file": ".github/workflows/blank1.yml",
        "line": 16,
        "description": "خطوات CI بسيطة (checkout + echo) بلا أوامر حساسة."
      }
    ]
  },
  "binaries_or_obfuscated": {
    "status": "None detected"
  },
  "recommendations_summary": [
    "إزالة جميع ملفات .env من المستودع العام وإنشاء ملفات مثال فقط.",
    "تدوير كلمات المرور والمفاتيح (PostgreSQL, NextAuth, Cloudinary) فورًا.",
    "استخدام حلول إدارة أسرار (مثل GitHub Secrets أو Vault) ونشر المتغيرات عبر إعدادات البنية التحتية." 
  ]
}
```