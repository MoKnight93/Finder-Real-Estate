# Finder — Real Estate Homepage (Demo Clone)

> ⚠️ **This is a demo / portfolio project, not a real product.**
> It is a front-end **clone** of the **Finder – Real Estate** homepage template by Createx Studio:
> <https://finder-html.createx.studio/home-real-estate.html>
> I built it to practise and show my front-end skills. It is **not affiliated with, or endorsed by, Createx Studio**.
> The original design, name and concept belong to their authors. All listings, prices, addresses, names,
> phone numbers and e-mails on the page are **fake placeholder data**. There is **no backend**:
> search, forms and links do nothing except what is listed under *Features*.

## Live pages

| File | Language | Direction |
|---|---|---|
| `index.html` | Arabic | RTL |
| `index-en.html` | English | LTR |

Use the 🌐 icon in the header to switch language, and the ☀️ icon to switch theme.

## Features

- Responsive layout (desktop navbar + mobile off-canvas menu on **both** languages)
- **Arabic / RTL** version with Bootstrap's official RTL build and the Cairo font
- **Dark mode** — Light / Dark / System, remembered in `localStorage`, applied before first paint (no flash)
- Price range slider that works correctly in LTR **and** RTL
- Location dropdown with live search
- Swiper carousels (listings, cities, partners, blog) and per-card photo sliders
- Scroll progress bar, Bootstrap tooltips

## Tech stack

HTML5 · CSS3 (logical properties, CSS variables) · Vanilla JavaScript · Bootstrap 5.3.3 · Swiper 11 · Font Awesome 6.7.2

## Project structure

```
.
├── index.html        # Arabic (RTL)
├── index-en.html     # English (LTR)
├── style.css         # Main styles (uses logical properties, so it mirrors in RTL by itself)
├── rtl.css           # Arabic-only extras (font, slider bubble, bidi)
├── dark-mode.css     # Dark theme, keyed on <html data-bs-theme="dark">
├── script.js         # Theme, slider, search, carousels, progress bar
└── Assets/
    ├── Images/       # photos and SVG icons used by the pages
    └── Vendor/
        ├── bootstrap-5.3.3-dist/    # needs css/bootstrap.min.css AND css/bootstrap.rtl.min.css
        └── fontawesome-free-6.7.2-web/
```

> The `Assets/` folder is not part of the code files. Keep your own copy next to the HTML files with the same paths.
> The Arabic page needs `bootstrap.rtl.min.css`; it ships in the same `css/` folder of the official Bootstrap download.

## Run it

No build step. Open `index.html` / `index-en.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Swiper and the Google Fonts (Inter, Cairo) load from a CDN, so an internet connection is needed for them.

## How RTL, dark mode and language work

- **Direction** comes from `<html dir="rtl|ltr">`. The Arabic page loads `bootstrap.rtl.min.css`; `style.css` uses
  `inline-start/inline-end` properties, so no per-property overrides are needed.
- **Theme** is `<html data-bs-theme="light|dark">`. Bootstrap components follow it automatically and
  `dark-mode.css` styles the custom parts. The choice is stored under the `theme` key (`light`, `dark` or `auto`).
- **Language** switch is a normal link between the two HTML files (so it also works with JavaScript disabled).

## Known limitations (it's a demo)

- Only the home page exists; every other menu link is `#`.
- Search / newsletter / app-store buttons are visual only.
- Property photos repeat across slides and cards.

## Credits

- Original design: [Createx Studio — Finder](https://finder-html.createx.studio/home-real-estate.html)
- Clone, RTL/Arabic version and dark mode: **Mohamed Samir**

---

# فايندر — الصفحة الرئيسية للعقارات (نسخة تجريبية)

> ⚠️ **هذا مشروع تجريبي لعرض المهارات وليس منتجًا حقيقيًا.**
> هو **استنساخ للواجهة الأمامية فقط** لقالب **Finder – Real Estate** من Createx Studio:
> <https://finder-html.createx.studio/home-real-estate.html>
> بنيته للتدرّب وإظهار مهاراتي في تطوير الواجهات، وهو **غير مرتبط بـ Createx Studio ولا معتمد منها**.
> التصميم الأصلي يعود لأصحابه. كل العقارات والأسعار والعناوين والأسماء وأرقام الهاتف والبريد في الصفحة **بيانات وهمية**،
> ولا يوجد **أي خادم (Backend)**؛ البحث والنماذج لا تُنفّذ شيئًا فعليًا.

**المميزات:** نسخة عربية RTL ونسخة إنجليزية LTR، الوضع الليلي (نهاري / ليلي / حسب النظام) مع حفظ الاختيار، شريط سعر يعمل في الاتجاهين،
قائمة مواقع مع بحث، سلايدر Swiper، وقائمة جوال جانبية في الصفحتين.

**التشغيل:** افتح `index.html` (عربي) أو `index-en.html` (إنجليزي) مباشرة في المتصفح، أو شغّل `python3 -m http.server 8000`.
تأكد أن مجلد `Assets/` موجود بجانب الملفات وأن `bootstrap.rtl.min.css` موجود داخل `Assets/Vendor/bootstrap-5.3.3-dist/css/`.

**الملاحظات:** الصفحة الرئيسية فقط موجودة، وباقي الروابط `#`.
