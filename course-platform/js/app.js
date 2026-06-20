/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — App boot + global event delegation
═══════════════════════════════════════════════════════════ */
(function () {
  const store = App.store, ui = App.ui, router = App.router;

  /* ---------- mobile menu ---------- */
  let mm, scrim;
  function buildMobile() {
    const u = store.currentUser();
    const out = [
      `<a href="#/"><i data-lucide="home"></i> Home</a>`,
      `<a href="#/courses"><i data-lucide="compass"></i> Courses</a>`,
      `<a href="#/wishlist"><i data-lucide="heart"></i> Wishlist</a>`,
      `<a href="#/cart"><i data-lucide="shopping-cart"></i> Cart</a>`,
    ];
    if (u) {
      out.push(`<a href="#/dashboard"><i data-lucide="layout-dashboard"></i> Dashboard</a>`);
      out.push(`<a href="#/my-courses"><i data-lucide="book-open"></i> My Courses</a>`);
      out.push(`<button data-action="logout"><i data-lucide="log-out"></i> Log out</button>`);
    } else {
      out.push(`<a href="#/login"><i data-lucide="log-in"></i> Log in</a>`);
      out.push(`<a href="#/register"><i data-lucide="user-plus"></i> Sign up</a>`);
    }
    out.push(`<a href="#/admin/login"><i data-lucide="shield"></i> Admin</a>`);
    return out.join("");
  }
  function openMobile() { mm.innerHTML = buildMobile(); ui.icons(); mm.classList.add("open"); scrim.classList.add("open"); }
  function closeMobile() { mm.classList.remove("open"); scrim.classList.remove("open"); }

  /* ---------- global click delegation ---------- */
  function onClick(e) {
    const el = e.target.closest("[data-action]");
    if (el) {
      const action = el.dataset.action;
      const id = el.dataset.id;
      switch (action) {
        case "toggle-wishlist": {
          const added = store.toggleWishlist(id);
          document.querySelectorAll(`[data-action="toggle-wishlist"][data-id="${id}"]`)
            .forEach((b) => b.classList.toggle("active", added));
          ui.toast(added ? "Added to wishlist" : "Removed from wishlist", added ? "success" : "info");
          if (location.hash.startsWith("#/wishlist") || location.hash.startsWith("#/course/")) router.reload();
          break;
        }
        case "add-cart": {
          const res = store.addToCart(id);
          if (res.ok) { ui.toast("Added to cart"); if (location.hash.startsWith("#/course/")) router.reload(); }
          else ui.toast(res.error, "error");
          break;
        }
        case "remove-cart": store.removeFromCart(id); ui.toast("Removed from cart", "info"); router.reload(); break;
        case "move-wishlist":
          if (!store.inWishlist(id)) store.toggleWishlist(id);
          store.removeFromCart(id); ui.toast("Moved to wishlist"); router.reload(); break;
        case "buy-now": {
          if (store.isEnrolled(id)) { ui.toast("You already own this course", "info"); break; }
          store.addToCart(id); ui.go("/checkout"); break;
        }
        case "play-preview": { const c = store.getCourse(id); if (c) ui.openVideoPreview(c); break; }
        case "toggle-accordion": { const it = el.closest(".accordion__item"); if (it) it.classList.toggle("open"); break; }
        case "toggle-user-menu": { const dd = el.closest(".dropdown"); if (dd) dd.classList.toggle("open"); break; }
        case "logout": store.logout(); closeMobile(); ui.toast("Logged out", "info"); ui.go("/"); break;
        case "admin-logout": store.adminLogout(); ui.toast("Signed out of admin", "info"); ui.go("/admin/login"); break;
        case "toggle-mobile": openMobile(); break;
        case "close-mobile": closeMobile(); break;
        case "close-modal": ui.closeModal(); break;
        case "complete-next": {
          const cid = el.dataset.course, key = el.dataset.key, next = el.dataset.next;
          const c = store.getCourse(cid);
          if (!store.completed(cid).includes(key)) store.toggleLecture(cid, key);
          if (next && c) { location.hash = `#/learn/${c.slug}?l=${next}`; }
          else { ui.toast("🎉 You finished the course!"); router.reload(); }
          break;
        }
        default: break;
      }
    }
    // close any open user dropdown when clicking outside of it
    const ddEl = e.target.closest(".dropdown");
    document.querySelectorAll(".dropdown.open").forEach((d) => { if (d !== ddEl) d.classList.remove("open"); });
  }

  /* ---------- global submit (search) ---------- */
  function onSubmit(e) {
    const f = e.target.closest('[data-action="search"]');
    if (!f) return;
    e.preventDefault();
    const q = (new FormData(f).get("q") || "").trim();
    closeMobile();
    location.hash = "#/courses" + (q ? "?q=" + encodeURIComponent(q) : "");
  }

  /* ---------- global change (player lecture checkboxes) ---------- */
  function onChange(e) {
    const el = e.target.closest('[data-action="toggle-lecture"]');
    if (!el) return;
    const id = el.dataset.course, key = el.dataset.key;
    store.toggleLecture(id, key);
    const pct = store.progressPct(id);
    const bar = document.getElementById("pct-bar"); if (bar) bar.style.width = pct + "%";
    const lbl = document.getElementById("pct-label"); if (lbl) lbl.textContent = pct + "%";
    const c = store.getCourse(id);
    if (c) {
      const cnt = document.getElementById("lec-count");
      if (cnt) cnt.textContent = store.completed(id).length + "/" + store.lectureKeys(c).length;
    }
    const row = el.closest(".player-lecture"); if (row) row.classList.toggle("done", el.checked);
  }

  /* ---------- keyboard ---------- */
  function onKey(e) { if (e.key === "Escape") { ui.closeModal(); closeMobile(); } }

  /* ---------- boot ---------- */
  function boot() {
    store.init();

    mm = document.createElement("div"); mm.className = "mobile-menu"; mm.id = "mobile-menu";
    scrim = document.createElement("div"); scrim.className = "scrim"; scrim.id = "mobile-scrim";
    document.body.append(mm, scrim);
    scrim.addEventListener("click", closeMobile);
    mm.addEventListener("click", (e) => { if (e.target.closest("a, button")) closeMobile(); });

    ui.renderChrome();
    store.subscribe(() => ui.renderChrome());

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    document.addEventListener("change", onChange);
    document.addEventListener("keydown", onKey);

    router.start();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
