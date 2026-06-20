/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — Shared UI (chrome, components, helpers)
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.ui = (function () {
  const store = App.store;

  /* ---------- helpers ---------- */
  function icons() { try { window.lucide && lucide.createIcons(); } catch (e) {} }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => (n === 0 ? "Free" : "$" + Number(n).toFixed(2));
  const num = (n) => Number(n).toLocaleString("en-US");
  function go(path) { location.hash = path; }

  function avatar(seed, size = 64) {
    return "https://ui-avatars.com/api/?name=" + encodeURIComponent(seed || "User") +
      "&background=0178CF&color=fff&bold=true&size=" + size;
  }

  /* branded SVG fallback for course thumbnails (never broken) */
  function fallbackSVG(course) {
    const cat = store.getCategory(course.categoryId) || { name: "Course", color: "#0178CF" };
    const c2 = cat.color || "#0178CF";
    const words = String(course.title || "Course").split(" ");
    const lines = []; let cur = "";
    words.forEach((w) => { if ((cur + " " + w).trim().length > 20) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
    if (cur.trim()) lines.push(cur.trim());
    const text = lines.slice(0, 3).map((l, i) =>
      `<text x="40" y="${190 + i * 40}" fill="#ffffff" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800">${esc(l)}</text>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="#0d1117"/></linearGradient></defs>
<rect width="800" height="450" fill="url(#g)"/>
<text x="40" y="80" fill="rgba(255,255,255,.85)" font-family="Inter,Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="2">${esc((cat.name || "").toUpperCase())}</text>
${text}
<text x="40" y="410" fill="rgba(255,255,255,.7)" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="700">SRUTAM Learn</text></svg>`;
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function courseImg(course, cls = "") {
    const fb = fallbackSVG(course);
    const src = course.image || fb;
    return `<img class="${cls}" loading="lazy" alt="${esc(course.title)}" src="${esc(src)}"
      onerror="this.onerror=null;this.src='${fb}'">`;
  }

  function stars(rating) {
    const r = Math.round(rating * 2) / 2;
    let full = Math.floor(r); const half = r - full === 0.5;
    let out = "";
    for (let i = 0; i < full; i++) out += `<i data-lucide="star"></i>`;
    if (half) out += `<i data-lucide="star-half"></i>`;
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++)
      out += `<i data-lucide="star" style="fill:transparent;color:var(--gray-300)"></i>`;
    return `<span class="stars">${out}</span>`;
  }

  function ratingLine(course) {
    return `<span class="rating-line"><b>${course.rating.toFixed(1)}</b>${stars(course.rating)}
      <span class="muted">(${num(course.ratingsCount)})</span></span>`;
  }

  /* ---------- course card ---------- */
  function courseCard(course) {
    const cat = store.getCategory(course.categoryId) || { name: "", color: "#0178CF" };
    const inst = store.getInstructor(course.instructorId);
    const wished = store.inWishlist(course.id);
    return `<a class="course-card" href="#/course/${course.slug}">
      <div class="course-card__thumb">
        ${courseImg(course)}
        <span class="course-card__cat" style="background:${cat.color}">${esc(cat.name)}</span>
        <button class="course-card__wish ${wished ? "active" : ""}" title="Wishlist"
          data-action="toggle-wishlist" data-id="${course.id}" onclick="event.preventDefault();">
          <i data-lucide="heart"></i>
        </button>
      </div>
      <div class="course-card__body">
        <h3 class="course-card__title">${esc(course.title)}</h3>
        <div class="course-card__inst">${esc(inst.name)}</div>
        ${ratingLine(course)}
        <div class="course-card__meta">
          <span><i data-lucide="clock"></i>${course.hours}h</span>
          <span><i data-lucide="play-circle"></i>${num(course.lectures)} lectures</span>
          <span><i data-lucide="bar-chart-2"></i>${esc((course.level || "").split(" ")[0])}</span>
        </div>
        ${course.bestseller ? '<span class="badge badge-bestseller">Bestseller</span>' : ""}
        <div class="course-card__foot">
          <div class="price">
            <span class="price__now ${course.price === 0 ? "price__free" : ""}">${money(course.price)}</span>
            ${course.oldPrice ? `<span class="price__old">${money(course.oldPrice)}</span>` : ""}
          </div>
          <button class="icon-btn" title="Add to cart" data-action="add-cart" data-id="${course.id}"
            onclick="event.preventDefault();"><i data-lucide="shopping-cart"></i></button>
        </div>
      </div>
    </a>`;
  }

  /* ---------- toast ---------- */
  function toast(msg, type = "success") {
    const host = document.getElementById("toast-host");
    const icon = type === "error" ? "alert-circle" : type === "info" ? "info" : "check-circle";
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.innerHTML = `<i data-lucide="${icon}"></i><span>${esc(msg)}</span>`;
    host.appendChild(t); icons();
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(20px)"; t.style.transition = ".3s"; setTimeout(() => t.remove(), 320); }, 2600);
  }

  /* ---------- modal ---------- */
  function openModal(inner, cls = "") {
    const host = document.getElementById("modal-host");
    host.className = "modal-host-open";
    host.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal ${cls}">${inner}</div>`;
    document.body.style.overflow = "hidden";
    icons();
  }
  function closeModal() {
    const host = document.getElementById("modal-host");
    host.className = ""; host.innerHTML = ""; document.body.style.overflow = "";
  }
  function openVideoPreview(course) {
    openModal(`<button class="modal__close" data-action="close-modal"><i data-lucide="x"></i></button>
      <video controls autoplay playsinline poster="${esc(course.image || fallbackSVG(course))}">
        <source src="${App.seed.sampleVideo}" type="video/mp4"></video>
      <div style="padding:16px 20px;color:#fff;background:#000">
        <strong>Preview · ${esc(course.title)}</strong>
        <div style="opacity:.7;font-size:.85rem">Sample lesson — full content unlocks on enrolment.</div>
      </div>`, "modal--video");
  }

  /* ---------- header / footer chrome ---------- */
  function header() {
    const user = store.currentUser();
    const cartN = store.cart().length;
    const wishN = store.wishlist().length;
    const userBlock = user
      ? `<div class="dropdown" id="user-dd">
           <button class="icon-btn" data-action="toggle-user-menu" style="width:auto;padding:0 4px;gap:8px">
             <img class="avatar" src="${avatar(user.avatarSeed || user.name, 76)}" alt="">
           </button>
           <div class="dropdown__menu">
             <div class="dropdown__head"><strong>${esc(user.name)}</strong><span>${esc(user.email)}</span></div>
             <a class="dropdown__item" href="#/dashboard"><i data-lucide="layout-dashboard"></i> Dashboard</a>
             <a class="dropdown__item" href="#/my-courses"><i data-lucide="book-open"></i> My Courses</a>
             <a class="dropdown__item" href="#/wishlist"><i data-lucide="heart"></i> Wishlist</a>
             <a class="dropdown__item" href="#/cart"><i data-lucide="shopping-cart"></i> Cart</a>
             <button class="dropdown__item" data-action="logout"><i data-lucide="log-out"></i> Log out</button>
           </div>
         </div>`
      : `<a class="nav__link nav__link--desktop" href="#/login">Log in</a>
         <a class="btn btn-primary btn-sm" href="#/register">Sign up</a>`;

    return `<div class="site-header"><nav class="nav" aria-label="Primary">
      <a class="nav__logo" href="#/"><img src="assets/logo.png" alt="SRUTAM Solution"><span class="badge-learn">LEARN</span></a>
      <form class="nav__search" data-action="search">
        <i data-lucide="search"></i>
        <input name="q" type="search" placeholder="Search for courses, topics, instructors..." aria-label="Search courses">
      </form>
      <div class="nav__links">
        <a class="nav__link nav__link--desktop" href="#/courses">Courses</a>
        <a class="icon-btn" href="#/wishlist" title="Wishlist">
          <i data-lucide="heart"></i>${wishN ? `<span class="count-badge">${wishN}</span>` : ""}</a>
        <a class="icon-btn" href="#/cart" title="Cart">
          <i data-lucide="shopping-cart"></i>${cartN ? `<span class="count-badge">${cartN}</span>` : ""}</a>
        ${userBlock}
        <button class="menu-toggle" data-action="toggle-mobile" aria-label="Menu"><i data-lucide="menu"></i></button>
      </div>
    </nav></div>`;
  }

  function footer() {
    const cats = store.allCategories();
    return `<div class="site-footer"><div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <img src="assets/logo.png" alt="SRUTAM Learn">
          <p>SRUTAM Learn is the online learning platform by SRUTAM Solution — expert-led courses for corporate teams, professionals and higher-education learners worldwide.</p>
        </div>
        <div class="footer__col"><h4>Categories</h4>
          ${cats.map((c) => `<a href="#/courses?category=${c.id}">${esc(c.name)}</a>`).join("")}
        </div>
        <div class="footer__col"><h4>Platform</h4>
          <a href="#/courses">All Courses</a>
          <a href="#/dashboard">My Dashboard</a>
          <a href="#/wishlist">Wishlist</a>
          <a href="#/cart">Cart</a>
          <a href="#/admin/login">Admin Login</a>
        </div>
        <div class="footer__col"><h4>Company</h4>
          <a href="https://www.srutam.in/" target="_blank" rel="noopener">About SRUTAM</a>
          <a href="https://www.srutam.in/#contact" target="_blank" rel="noopener">Contact</a>
          <a href="#/courses">Become an Instructor</a>
          <a href="#/register">Sign Up Free</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; <span id="cp-year"></span> SRUTAM Solution · SRUTAM Learn. Demo platform.</span>
        <span>Built for demonstration — no real payments are processed.</span>
      </div>
    </div></div>`;
  }

  function renderChrome() {
    document.getElementById("app-header").innerHTML = header();
    document.getElementById("app-footer").innerHTML = footer();
    const y = document.getElementById("cp-year"); if (y) y.textContent = new Date().getFullYear();
    icons();
  }

  return {
    icons, esc, money, num, go, avatar, fallbackSVG, courseImg, stars, ratingLine,
    courseCard, toast, openModal, closeModal, openVideoPreview, renderChrome, header, footer,
  };
})();
