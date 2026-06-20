/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — Hash Router
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.router = (function () {
  const V = App.views, A = App.admin;

  // Order matters: more specific patterns first.
  const routes = [
    { p: "/",                 view: () => V.home },
    { p: "/courses",          view: () => V.courses },
    { p: "/course/:slug",     view: () => V.course },
    { p: "/learn/:slug",      view: () => V.player },
    { p: "/dashboard",        view: () => V.dashboard },
    { p: "/my-courses",       view: () => V.myCourses },
    { p: "/wishlist",         view: () => V.wishlist },
    { p: "/cart",             view: () => V.cart },
    { p: "/checkout",         view: () => V.checkout },
    { p: "/login",            view: () => V.login },
    { p: "/register",         view: () => V.register },
    { p: "/admin",            view: () => A.adminDashboard },
    { p: "/admin/login",      view: () => A.adminLogin },
    { p: "/admin/courses",    view: () => A.adminCourses },
    { p: "/admin/categories", view: () => A.adminCategories },
    { p: "/admin/users",      view: () => A.adminUsers },
    { p: "/admin/enrollments",view: () => A.adminEnrollments },
    { p: "/admin/analytics",  view: () => A.adminAnalytics },
  ];

  let lastPath = null;

  function parse() {
    let hash = location.hash.replace(/^#/, "");
    if (!hash || hash === "/") hash = "/";
    const [pathRaw, queryRaw] = hash.split("?");
    const path = pathRaw.replace(/\/+$/, "") || "/";
    const query = {};
    if (queryRaw) new URLSearchParams(queryRaw).forEach((v, k) => (query[k] = v));
    return { path, query };
  }

  function match(path) {
    const segs = path.split("/").filter(Boolean);
    for (const r of routes) {
      const rs = r.p.split("/").filter(Boolean);
      if (rs.length !== segs.length) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < rs.length; i++) {
        if (rs[i].startsWith(":")) params[rs[i].slice(1)] = decodeURIComponent(segs[i]);
        else if (rs[i] !== segs[i]) { ok = false; break; }
      }
      if (ok) return { view: r.view(), params };
    }
    return { view: V.notFound, params: {} };
  }

  function render() {
    const { path, query } = parse();
    const { view, params } = match(path);
    const ctx = { params, query, path };
    const root = document.getElementById("app-root");
    root.innerHTML = view.render(ctx) || "";
    if (typeof view.mount === "function") {
      try { view.mount(root, ctx); } catch (e) { console.error("mount error", e); }
    }
    App.ui.icons();
    // scroll to top only when the path (not just query) changes
    if (path !== lastPath) { window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); }
    lastPath = path;
  }

  function start() {
    window.addEventListener("hashchange", render);
    if (!location.hash) location.replace("#/");
    render();
  }
  function reload() { render(); }

  return { start, render, reload, parse };
})();
