/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — Admin module
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.admin = (function () {
  const ui = App.ui, store = App.store;
  const { esc, money, num } = ui;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabel = (ym) => { const [, m] = (ym || "").split("-"); return MONTHS[(parseInt(m, 10) || 1) - 1] || ym; };

  function guard(next) {
    if (!store.isAdmin()) { location.hash = "#/admin/login"; return false; }
    return true;
  }

  /* ---------- layout ---------- */
  function layout(active, body) {
    const link = (key, href, icon, label) =>
      `<a class="${active === key ? "active" : ""}" href="${href}"><i data-lucide="${icon}"></i> ${label}</a>`;
    return `<div class="admin">
      <aside class="admin__side">
        <div class="admin__brand"><i data-lucide="shield"></i> Admin Panel</div>
        <nav class="admin__nav">
          ${link("dashboard", "#/admin", "layout-dashboard", "Dashboard")}
          ${link("courses", "#/admin/courses", "book-open", "Courses")}
          ${link("categories", "#/admin/categories", "tags", "Categories")}
          ${link("users", "#/admin/users", "users", "Users")}
          ${link("enrollments", "#/admin/enrollments", "graduation-cap", "Enrollments")}
          ${link("analytics", "#/admin/analytics", "bar-chart-3", "Analytics")}
          <a href="#/" style="margin-top:14px"><i data-lucide="external-link"></i> Back to site</a>
          <button class="admin__nav-logout" data-action="admin-logout" style="display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:10px;color:#fca5a5;font-weight:500;width:100%;text-align:left"><i data-lucide="log-out"></i> Log out</button>
        </nav>
      </aside>
      <main class="admin__main">${body}</main>
    </div>`;
  }

  /* ════════ ADMIN LOGIN ════════ */
  const adminLogin = {
    render() {
      if (store.isAdmin()) { setTimeout(() => (location.hash = "#/admin"), 0); }
      return `<div class="auth-wrap">
        <div class="auth-aside"><h2>SRUTAM Learn · Admin</h2>
          <p>Manage courses, categories, users, enrolments and view platform analytics.</p>
          ${[["layout-dashboard", "Real-time analytics dashboard"], ["book-open", "Full course management (CRUD)"],
             ["users", "Manage learners & enrolments"], ["tags", "Organise course categories"]]
            .map(([i, t]) => `<div class="pt"><i data-lucide="${i}"></i> ${t}</div>`).join("")}
        </div>
        <div class="auth-main"><div class="auth-box">
          <h1>Admin Login</h1><p class="sub">Restricted area — administrators only.</p>
          <form id="admin-login-form">
            <div class="form-error" id="adm-err" hidden></div>
            <div class="field"><label>Admin email</label><input name="email" type="email" placeholder="admin@srutam.in" required></div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="••••••••" required></div>
            <button class="btn btn-primary btn-block btn-lg" type="submit"><i data-lucide="shield"></i> Sign in to Admin</button>
          </form>
          <div class="demo-creds">Demo admin — <b>admin@srutam.in</b> / <b>admin1234</b></div>
          <div class="auth-switch"><a href="#/">← Back to SRUTAM Learn</a></div>
        </div></div>
      </div>`;
    },
    mount(root) {
      const form = root.querySelector("#admin-login-form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const res = store.adminLogin(fd.get("email"), fd.get("password"));
        if (res.ok) { ui.toast("Welcome, Admin"); ui.go("/admin"); }
        else { const el = root.querySelector("#adm-err"); el.textContent = res.error; el.hidden = false; }
      });
    },
  };

  /* ════════ DASHBOARD ════════ */
  const adminDashboard = {
    render() {
      if (!guard()) return "";
      const a = store.analytics();
      const stat = (icon, color, val, label, sub) =>
        `<div class="stat-card"><div class="stat-card__icon" style="background:${color}"><i data-lucide="${icon}"></i></div>
          <b>${val}</b><span>${label}</span>${sub ? `<small>${sub}</small>` : ""}</div>`;
      const recent = store.enrichedEnrollments().slice(0, 6);
      return layout("dashboard", `
        <h1>Dashboard</h1><p class="muted" style="margin-bottom:24px">Platform overview at a glance.</p>
        <div class="stat-cards">
          ${stat("dollar-sign", "#10b981", money(a.revenue), "Total revenue", "demo data")}
          ${stat("graduation-cap", "#0178CF", num(a.enrollments), "Enrollments")}
          ${stat("users", "#7C3AED", num(a.students), "Registered users")}
          ${stat("book-open", "#f59e0b", num(a.courses), "Published courses")}
        </div>
        <div class="dash-grid">
          <div class="card">
            <div class="card__head"><h3>Top courses by enrolment</h3><a class="btn btn-ghost btn-sm" href="#/admin/analytics">Analytics</a></div>
            <div class="table-wrap" style="border:none">
              <table class="data"><thead><tr><th>Course</th><th>Enrolments</th><th>Revenue</th></tr></thead><tbody>
                ${a.topCourses.slice(0, 5).map((t) => `<tr>
                  <td><div class="cell-course">${ui.courseImg(t.course)}<strong>${esc(t.course.title)}</strong></div></td>
                  <td>${t.count}</td><td>${money(t.revenue)}</td></tr>`).join("")}
              </tbody></table>
            </div>
          </div>
          <div class="card">
            <div class="card__head"><h3>Recent enrolments</h3></div>
            ${recent.map((e) => `<div class="learn-row" style="padding:10px 0">
              <img class="avatar" style="width:40px;height:40px" src="${ui.avatar(e.user ? e.user.name : "User", 80)}" alt="">
              <div class="learn-row__info"><strong>${esc(e.user ? e.user.name : "Unknown")}</strong>
                <div class="muted" style="font-size:.8rem">${esc(e.course ? e.course.title : "—")}</div></div>
              <div class="muted" style="font-size:.8rem">${esc(e.date)}</div>
            </div>`).join("") || '<p class="muted">No enrolments yet.</p>'}
          </div>
        </div>`);
    },
  };

  /* ════════ COURSES ════════ */
  const adminCourses = {
    render() {
      if (!guard()) return "";
      const list = store.allCourses();
      return layout("courses", `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px">
          <div><h1>Courses</h1><p class="muted">${list.length} course${list.length !== 1 ? "s" : ""} · create, edit or remove</p></div>
          <button class="btn btn-primary" data-action="course-new"><i data-lucide="plus"></i> Add course</button>
        </div>
        <div class="table-wrap">
          <table class="data"><thead><tr><th>Course</th><th>Category</th><th>Price</th><th>Rating</th><th>Students</th><th>Actions</th></tr></thead><tbody>
            ${list.map((c) => {
              const cat = store.getCategory(c.categoryId) || {};
              return `<tr>
                <td><div class="cell-course">${ui.courseImg(c)}<div><strong>${esc(c.title)}</strong>
                  <div class="muted" style="font-size:.78rem">${esc(store.getInstructor(c.instructorId).name)}</div></div></div></td>
                <td><span class="pill pill-blue">${esc(cat.name || "—")}</span></td>
                <td><b>${money(c.price)}</b></td>
                <td>${c.rating.toFixed(1)} ★</td>
                <td>${num(c.students)}</td>
                <td><div class="cell-actions">
                  <button class="icon-action" title="Edit" data-action="course-edit" data-id="${c.id}"><i data-lucide="pencil"></i></button>
                  <button class="icon-action danger" title="Delete" data-action="course-del" data-id="${c.id}"><i data-lucide="trash-2"></i></button>
                </div></td></tr>`;
            }).join("")}
          </tbody></table>
        </div>`);
    },
    mount(root) {
      root.querySelector('[data-action="course-new"]').addEventListener("click", () => openCourseModal());
      root.querySelectorAll('[data-action="course-edit"]').forEach((b) =>
        b.addEventListener("click", () => openCourseModal(b.dataset.id)));
      root.querySelectorAll('[data-action="course-del"]').forEach((b) =>
        b.addEventListener("click", () => {
          const c = store.getCourse(b.dataset.id);
          if (confirm(`Delete “${c.title}”? This also removes its enrolments.`)) {
            store.deleteCourse(b.dataset.id); ui.toast("Course deleted", "info"); App.router.reload();
          }
        }));
    },
  };

  function openCourseModal(id) {
    const c = id ? store.getCourse(id) : null;
    const cats = store.allCategories();
    const insts = App.seed.instructors;
    const val = (k, d = "") => (c && c[k] != null ? c[k] : d);
    ui.openModal(`
      <div class="modal__head"><h3>${c ? "Edit course" : "Add course"}</h3>
        <button class="modal__close" data-action="close-modal"><i data-lucide="x"></i></button></div>
      <div class="modal__body"><form id="course-form">
        <div class="field"><label>Title</label><input name="title" value="${esc(val("title"))}" required></div>
        <div class="field"><label>Subtitle</label><textarea name="subtitle" rows="2">${esc(val("subtitle"))}</textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="field"><label>Category</label><select name="categoryId">
            ${cats.map((x) => `<option value="${x.id}" ${val("categoryId") === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
          <div class="field"><label>Instructor</label><select name="instructorId">
            ${insts.map((x) => `<option value="${x.id}" ${val("instructorId") === x.id ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
          <div class="field"><label>Price ($)</label><input name="price" type="number" step="0.01" min="0" value="${val("price", 0)}"></div>
          <div class="field"><label>Old price ($)</label><input name="oldPrice" type="number" step="0.01" min="0" value="${val("oldPrice", 0)}"></div>
          <div class="field"><label>Hours</label><input name="hours" type="number" min="0" value="${val("hours", 10)}"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="field"><label>Level</label><select name="level">
            ${["Beginner", "Intermediate", "Advanced", "All Levels", "Beginner to Advanced", "Beginner to Intermediate"]
              .map((l) => `<option ${val("level") === l ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="field"><label>Lectures</label><input name="lectures" type="number" min="0" value="${val("lectures", 0)}"></div>
        </div>
        <div class="field"><label>Thumbnail image URL <span class="hint" style="display:inline">(optional — branded fallback used if empty)</span></label>
          <input name="image" value="${esc(val("image"))}" placeholder="https://images.unsplash.com/..."></div>
        <div class="field"><label><input type="checkbox" name="bestseller" ${val("bestseller") ? "checked" : ""} style="width:auto;margin-right:6px;vertical-align:-1px">Mark as bestseller</label></div>
        <div class="field"><label>What you'll learn <span class="hint" style="display:inline">(one per line)</span></label>
          <textarea name="whatYouLearn" rows="4">${esc((val("whatYouLearn", []) || []).join("\n"))}</textarea></div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">${c ? "Save changes" : "Create course"}</button>
      </form></div>`);
    const form = document.getElementById("course-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        title: fd.get("title").trim(),
        subtitle: fd.get("subtitle").trim(),
        categoryId: fd.get("categoryId"),
        instructorId: fd.get("instructorId"),
        price: parseFloat(fd.get("price")) || 0,
        oldPrice: parseFloat(fd.get("oldPrice")) || 0,
        hours: parseInt(fd.get("hours"), 10) || 0,
        lectures: parseInt(fd.get("lectures"), 10) || 0,
        level: fd.get("level"),
        image: fd.get("image").trim(),
        bestseller: !!fd.get("bestseller"),
        whatYouLearn: fd.get("whatYouLearn").split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (c) data.id = c.id;
      store.saveCourse(data);
      ui.closeModal();
      ui.toast(c ? "Course updated" : "Course created");
      App.router.reload();
    });
  }

  /* ════════ CATEGORIES ════════ */
  const adminCategories = {
    render() {
      if (!guard()) return "";
      const cats = store.allCategories();
      return layout("categories", `
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px">
          <div><h1>Categories</h1><p class="muted">${cats.length} categories</p></div>
          <button class="btn btn-primary" data-action="cat-new"><i data-lucide="plus"></i> Add category</button>
        </div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Category</th><th>Courses</th><th>Colour</th><th>Actions</th></tr></thead><tbody>
          ${cats.map((c) => {
            const n = store.queryCourses({ category: c.id }).length;
            return `<tr>
              <td><div class="cell-course"><span class="cat-tile__icon" style="width:38px;height:38px;margin:0;background:${c.color}"><i data-lucide="${c.icon}" style="width:18px;height:18px"></i></span><strong>${esc(c.name)}</strong></div></td>
              <td>${n}</td>
              <td><span class="pill" style="background:${c.color};color:#fff">${esc(c.color)}</span></td>
              <td><div class="cell-actions">
                <button class="icon-action" data-action="cat-edit" data-id="${c.id}"><i data-lucide="pencil"></i></button>
                <button class="icon-action danger" data-action="cat-del" data-id="${c.id}"><i data-lucide="trash-2"></i></button>
              </div></td></tr>`;
          }).join("")}
        </tbody></table></div>`);
    },
    mount(root) {
      root.querySelector('[data-action="cat-new"]').addEventListener("click", () => openCatModal());
      root.querySelectorAll('[data-action="cat-edit"]').forEach((b) =>
        b.addEventListener("click", () => openCatModal(b.dataset.id)));
      root.querySelectorAll('[data-action="cat-del"]').forEach((b) =>
        b.addEventListener("click", () => {
          const c = store.getCategory(b.dataset.id);
          const n = store.queryCourses({ category: c.id }).length;
          if (confirm(`Delete category “${c.name}”?${n ? ` ${n} course(s) will keep their category id.` : ""}`)) {
            store.deleteCategory(b.dataset.id); ui.toast("Category deleted", "info"); App.router.reload();
          }
        }));
    },
  };

  function openCatModal(id) {
    const c = id ? store.getCategory(id) : null;
    const icons = ["code-2", "brain-circuit", "palette", "megaphone", "graduation-cap", "trending-up", "camera", "music", "heart-pulse", "globe", "briefcase", "tag"];
    ui.openModal(`
      <div class="modal__head"><h3>${c ? "Edit category" : "Add category"}</h3>
        <button class="modal__close" data-action="close-modal"><i data-lucide="x"></i></button></div>
      <div class="modal__body"><form id="cat-form">
        <div class="field"><label>Name</label><input name="name" value="${esc(c ? c.name : "")}" required></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="field"><label>Icon</label><select name="icon">
            ${icons.map((i) => `<option ${c && c.icon === i ? "selected" : ""}>${i}</option>`).join("")}</select></div>
          <div class="field"><label>Colour</label><input name="color" type="color" value="${c ? c.color : "#0178CF"}" style="height:46px;padding:4px"></div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">${c ? "Save" : "Create category"}</button>
      </form></div>`);
    const form = document.getElementById("cat-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = { name: fd.get("name").trim(), icon: fd.get("icon"), color: fd.get("color") };
      if (c) data.id = c.id;
      store.saveCategory(data); ui.closeModal();
      ui.toast(c ? "Category updated" : "Category created"); App.router.reload();
    });
  }

  /* ════════ USERS ════════ */
  const adminUsers = {
    render() {
      if (!guard()) return "";
      const users = store.allUsers();
      return layout("users", `
        <h1>Users</h1><p class="muted" style="margin-bottom:20px">${users.length} registered learners</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Enrolments</th><th>Joined</th><th>Actions</th></tr></thead><tbody>
          ${users.map((u) => {
            const n = store.enrollmentsForUser(u.id).length;
            return `<tr>
              <td><div class="cell-course"><img class="avatar" style="width:38px;height:38px" src="${ui.avatar(u.name, 76)}" alt=""><strong>${esc(u.name)}</strong></div></td>
              <td>${esc(u.email)}</td>
              <td><span class="pill pill-gray">${esc(u.role || "student")}</span></td>
              <td>${n}</td>
              <td>${esc(u.joined || "—")}</td>
              <td><div class="cell-actions">
                <button class="icon-action danger" data-action="user-del" data-id="${u.id}"><i data-lucide="trash-2"></i></button>
              </div></td></tr>`;
          }).join("")}
        </tbody></table></div>`);
    },
    mount(root) {
      root.querySelectorAll('[data-action="user-del"]').forEach((b) =>
        b.addEventListener("click", () => {
          const u = store.allUsers().find((x) => x.id === b.dataset.id);
          if (confirm(`Delete user “${u.name}” and their enrolments?`)) {
            store.deleteUser(b.dataset.id); ui.toast("User deleted", "info"); App.router.reload();
          }
        }));
    },
  };

  /* ════════ ENROLLMENTS ════════ */
  const adminEnrollments = {
    render() {
      if (!guard()) return "";
      const rows = store.enrichedEnrollments();
      return layout("enrollments", `
        <h1>Enrollments</h1><p class="muted" style="margin-bottom:20px">${rows.length} total enrolments · ${money(store.analytics().revenue)} revenue</p>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>Learner</th><th>Course</th><th>Category</th><th>Price</th><th>Date</th></tr></thead><tbody>
          ${rows.map((e) => {
            const cat = e.course ? store.getCategory(e.course.categoryId) : null;
            return `<tr>
              <td><div class="cell-course"><img class="avatar" style="width:34px;height:34px" src="${ui.avatar(e.user ? e.user.name : "User", 68)}" alt="">
                <div><strong>${esc(e.user ? e.user.name : "Unknown")}</strong><div class="muted" style="font-size:.76rem">${esc(e.user ? e.user.email : "")}</div></div></div></td>
              <td>${esc(e.course ? e.course.title : "—")}</td>
              <td><span class="pill pill-blue">${esc(cat ? cat.name : "—")}</span></td>
              <td><b>${money(e.price || 0)}</b></td>
              <td>${esc(e.date)}</td></tr>`;
          }).join("") || '<tr><td colspan="5" class="muted" style="text-align:center;padding:30px">No enrolments yet.</td></tr>'}
        </tbody></table></div>`);
    },
  };

  /* ════════ ANALYTICS ════════ */
  const adminAnalytics = {
    render() {
      if (!guard()) return "";
      const a = store.analytics();
      // monthly enrolments
      const monthKeys = Object.keys(a.months).sort();
      const maxMonth = Math.max(1, ...Object.values(a.months));
      const bars = monthKeys.map((k) => `<div class="bar-col">
        <span class="bar-val">${a.months[k]}</span>
        <div class="bar" style="height:${Math.round((a.months[k] / maxMonth) * 100)}%"></div>
        <span class="bar-label">${monthLabel(k)}</span></div>`).join("");
      // revenue by category
      const maxRev = Math.max(1, ...a.byCategory.map((c) => c.revenue));
      const hbars = a.byCategory.filter((c) => c.count > 0).sort((x, y) => y.revenue - x.revenue).map((c) => `
        <div class="hbar"><div class="hbar__top"><b>${esc(c.name)}</b><span>${money(c.revenue)} · ${c.count} enrol.</span></div>
          <div class="hbar__track"><div class="hbar__fill" style="width:${Math.round((c.revenue / maxRev) * 100)}%;background:${c.color}"></div></div></div>`).join("");

      return layout("analytics", `
        <h1>Analytics</h1><p class="muted" style="margin-bottom:24px">Demo metrics derived from enrolment data.</p>
        <div class="stat-cards">
          <div class="stat-card"><div class="stat-card__icon" style="background:#10b981"><i data-lucide="dollar-sign"></i></div><b>${money(a.revenue)}</b><span>Total revenue</span></div>
          <div class="stat-card"><div class="stat-card__icon" style="background:#0178CF"><i data-lucide="graduation-cap"></i></div><b>${num(a.enrollments)}</b><span>Enrollments</span></div>
          <div class="stat-card"><div class="stat-card__icon" style="background:#7C3AED"><i data-lucide="users"></i></div><b>${num(a.students)}</b><span>Users</span></div>
          <div class="stat-card"><div class="stat-card__icon" style="background:#f59e0b"><i data-lucide="receipt"></i></div><b>${money(a.enrollments ? a.revenue / a.enrollments : 0)}</b><span>Avg. order value</span></div>
        </div>
        <div class="dash-grid">
          <div class="card">
            <div class="card__head"><h3>Enrolments per month</h3></div>
            ${monthKeys.length ? `<div class="chart-bars">${bars}</div>` : '<p class="muted">No data yet.</p>'}
          </div>
          <div class="card">
            <div class="card__head"><h3>Revenue by category</h3></div>
            ${hbars || '<p class="muted">No data yet.</p>'}
          </div>
        </div>
        <div class="card" style="margin-top:24px">
          <div class="card__head"><h3>Course performance</h3></div>
          <div class="table-wrap" style="border:none"><table class="data">
            <thead><tr><th>#</th><th>Course</th><th>Enrolments</th><th>Revenue</th><th>Rating</th></tr></thead><tbody>
            ${a.topCourses.map((t, i) => `<tr>
              <td><b>${i + 1}</b></td>
              <td><div class="cell-course">${ui.courseImg(t.course)}<strong>${esc(t.course.title)}</strong></div></td>
              <td>${t.count}</td><td>${money(t.revenue)}</td><td>${t.course.rating.toFixed(1)} ★</td></tr>`).join("")}
          </tbody></table></div>
        </div>`);
    },
  };

  return { adminLogin, adminDashboard, adminCourses, adminCategories, adminUsers, adminEnrollments, adminAnalytics };
})();
