# SRUTAM Learn — Online Course Platform (Demo)

A polished, Coursera/Udemy-style online learning platform built as a **client demo** for
SRUTAM Solution. It reuses the branding (colours, fonts, logo) of the main
[srutam.in](https://www.srutam.in) website.

> ⚠️ **Demo only.** All data is dummy content, there is **no backend**, and **no real
> payments** are processed. State (accounts, cart, enrolments, progress) is saved in the
> browser's `localStorage`.

---

## ✨ Tech stack

- **Vanilla HTML / CSS / JavaScript** — no framework, **no build step**.
- Single-page app with a lightweight **hash router** (`#/courses`, `#/course/:slug`, …).
- Icons via [Lucide](https://lucide.dev) (CDN), fonts via Google Fonts (Inter).
- Royalty-free imagery from Unsplash with an automatic **branded SVG fallback**, so a
  thumbnail never appears broken — even offline.

Because it uses hash routing and plain static files, it deploys to **any** static host with
**zero server configuration**.

---

## 🚀 Run locally

Any static file server works. The simplest options:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000

# or Node
npx serve .
```

You can also just **double-click `index.html`** (an internet connection is needed for the
icon font, images and sample video, which load from CDNs).

---

## 🔑 Demo credentials

| Role    | URL              | Email                | Password    |
|---------|------------------|----------------------|-------------|
| Learner | `#/login`        | `student@demo.com`   | `demo1234`  |
| Admin   | `#/admin/login`  | `admin@srutam.in`    | `admin1234` |

You can also register a brand-new learner account from `#/register`.

---

## 🧩 Features

### Learner experience
- **Home** with hero, category browse, featured/most-popular courses and CTAs.
- **Course catalog** with live **search**, **filters** (category, level, price, rating) and **sorting**.
- **Course detail** page — curriculum accordion, what-you'll-learn, requirements, instructor,
  reviews, and a sticky purchase card with **free preview** video.
- **Authentication** — register / login (persisted), with protected pages.
- **Cart** + **demo checkout** (billing + fake card fields, no real payment).
- **Wishlist** (heart any course).
- **My Courses** + **learner dashboard** (stats, continue-learning, recommendations).
- **Course player** — video, lesson sidebar, mark-complete and live **progress tracking**.
- Fully **responsive** (desktop / tablet / mobile) with a slide-in mobile menu.

### Admin experience (`#/admin`)
- Separate **admin login** and a dedicated sidebar layout.
- **Dashboard** — revenue, enrolments, users, courses, top courses, recent activity.
- **Manage Courses** — create / edit / delete (modal form).
- **Manage Categories** — create / edit / delete (icon + colour).
- **Manage Users** — list & remove learners.
- **Enrollments** — full enrolment ledger.
- **Analytics** — enrolments-per-month bar chart, revenue-by-category bars, course ranking.

---

## 📁 Project structure

```
course-platform/
├── index.html          App shell (loads scripts + chrome mount points)
├── css/app.css         All styles + brand tokens + responsive
├── assets/logo.png     SRUTAM logo
└── js/
    ├── data.js         Seed data: 6 courses, categories, instructors, lessons, reviews
    ├── store.js        State + localStorage (auth, cart, wishlist, enrol, progress, CRUD)
    ├── ui.js           Shared components (header, footer, cards, stars, toast, modal)
    ├── views.js        Learner views (home, catalog, course, player, dashboard, cart, …)
    ├── admin.js        Admin views (login, dashboard, courses, categories, users, …)
    ├── router.js       Hash router
    └── app.js          Boot + global event delegation
```

---

## ☁️ Deploying to `course.srutam.in`

1. Point the `course.srutam.in` subdomain at your host's web root.
2. Upload the **contents of this `course-platform/` folder** to that web root.
3. Done — open `https://course.srutam.in`.

No rewrites or special server config are required (hash routing handles navigation
client-side). Works on Apache, Nginx, cPanel, Netlify, Vercel, GitHub Pages, etc.

---

## 🛠️ Customising

- **Courses / categories / instructors** → edit `js/data.js`.
- **Brand colours, fonts, radius** → CSS variables at the top of `css/app.css`.
- **Reset the demo** to its seed state → run `App.store.resetDemo()` in the browser console
  (or clear site data / `localStorage`).

---

© SRUTAM Solution · SRUTAM Learn (demo).
