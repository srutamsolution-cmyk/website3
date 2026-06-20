/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — User-facing views
   Each view: { render(ctx) -> html, mount?(root, ctx) }
   ctx = { params, query }
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.views = (function () {
  const ui = App.ui, store = App.store;
  const { esc, money, num } = ui;

  /* ---------- shared bits ---------- */
  function needLogin(message, next) {
    return `<div class="page"><div class="container"><div class="empty" style="max-width:460px;margin:0 auto">
      <i data-lucide="lock"></i>
      <h2 style="margin-bottom:8px">Please sign in</h2>
      <p style="margin-bottom:20px">${esc(message)}</p>
      <a class="btn btn-primary" href="#/login${next ? "?next=" + encodeURIComponent(next) : ""}">Log in to continue</a>
    </div></div></div>`;
  }
  const courseGrid = (list) => `<div class="course-grid">${list.map(ui.courseCard).join("")}</div>`;

  /* ════════ HOME ════════ */
  const home = {
    render() {
      const cats = store.allCategories();
      const popular = store.queryCourses({ sort: "popular" });
      const totalStudents = store.allCourses().reduce((s, c) => s + c.students, 0);
      const heroImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80";
      return `
      <section class="hero"><div class="container"><div class="hero__inner">
        <div>
          <span class="hero__eyebrow"><i data-lucide="sparkles"></i> SRUTAM Learn · Online Learning Platform</span>
          <h1>Learn the skills that move careers forward</h1>
          <p class="lead">Expert-led courses in development, data science, design, marketing, business and instructional design — learn at your own pace, on any device.</p>
          <div class="hero__actions">
            <a class="btn btn-primary btn-lg" href="#/courses"><i data-lucide="compass"></i> Explore Courses</a>
            <a class="btn btn-outline btn-lg" href="#/register">Join Free</a>
          </div>
          <div class="hero__stats">
            <div class="hero__stat"><b>${store.allCourses().length}+</b><span>Expert courses</span></div>
            <div class="hero__stat"><b>${(totalStudents / 1000).toFixed(0)}k+</b><span>Learners enrolled</span></div>
            <div class="hero__stat"><b>4.7★</b><span>Average rating</span></div>
          </div>
        </div>
        <div class="hero__media">
          <img src="${heroImg}" alt="Learners" onerror="this.style.display='none'">
          <div class="floating-card"><i data-lucide="badge-check"></i><div><b>Certificate</b><span>on completion</span></div></div>
        </div>
      </div></div></section>

      <section class="band"><div class="container"><div class="band__grid">
        ${[["monitor-play", "On-demand video", "Learn anytime, on any device"],
           ["infinity", "Lifetime access", "Revisit your courses forever"],
           ["award", "Shareable certificates", "Showcase your achievements"],
           ["shield-check", "30-day guarantee", "Risk-free, money-back promise"]]
          .map(([i, t, p]) => `<div class="feature"><div class="feature__icon"><i data-lucide="${i}"></i></div>
            <div><strong>${t}</strong><p>${p}</p></div></div>`).join("")}
      </div></div></section>

      <section class="section" style="padding:56px 0"><div class="container">
        <div class="section-head"><div><div class="tag">Browse</div><h2 class="section-title">Top categories</h2></div>
          <a class="btn btn-ghost" href="#/courses">All courses <i data-lucide="arrow-right"></i></a></div>
        <div class="cats">
          ${cats.map((c) => {
            const n = store.queryCourses({ category: c.id }).length;
            return `<a class="cat-tile" href="#/courses?category=${c.id}">
              <div class="cat-tile__icon" style="background:${c.color}"><i data-lucide="${c.icon}"></i></div>
              <strong>${esc(c.name)}</strong><span>${n} course${n !== 1 ? "s" : ""}</span></a>`;
          }).join("")}
        </div>
      </div></section>

      <section class="section" style="padding:10px 0 56px"><div class="container">
        <div class="section-head"><div><div class="tag">Hand-picked</div><h2 class="section-title">Featured &amp; most popular</h2></div>
          <a class="btn btn-ghost" href="#/courses">View all <i data-lucide="arrow-right"></i></a></div>
        ${courseGrid(popular)}
      </div></section>

      <section class="section" style="padding:0 0 70px"><div class="container">
        <div class="cta">
          <h2>Upskill your team or yourself</h2>
          <p>Give your organisation access to a curated library of high-quality courses — or start learning today with a free account.</p>
          <div class="hero__actions" style="justify-content:center">
            <a class="btn btn-primary btn-lg" href="#/register">Get started free</a>
            <a class="btn btn-outline btn-lg" href="https://www.srutam.in/#contact" target="_blank" rel="noopener">SRUTAM for Business</a>
          </div>
        </div>
      </div></section>`;
    },
  };

  /* ════════ CATALOG ════════ */
  const courses = {
    render(ctx) {
      const q = ctx.query || {};
      const filter = {
        q: q.q || "", category: q.category || "all", level: q.level || "all",
        price: q.price || "all", minRating: q.rating ? parseFloat(q.rating) : 0, sort: q.sort || "popular",
      };
      const list = store.queryCourses(filter);
      const cats = store.allCategories();
      const radio = (name, val, cur, label) =>
        `<label class="filter-opt"><input type="radio" name="${name}" value="${val}" ${cur === val ? "checked" : ""}> ${label}</label>`;

      return `<div class="page"><div class="container">
        <div class="breadcrumb"><a href="#/">Home</a> / <span>Courses</span></div>
        <div class="page__head"><h1>${filter.q ? `Results for “${esc(filter.q)}”` : "All Courses"}</h1>
          <p>${list.length} course${list.length !== 1 ? "s" : ""} available</p></div>
        <div class="catalog">
          <aside class="filters" id="filters">
            <div class="filters__group">
              <h4>Category</h4>
              ${radio("category", "all", filter.category, "All categories")}
              ${cats.map((c) => radio("category", c.id, filter.category, esc(c.name))).join("")}
            </div>
            <div class="filters__group">
              <h4>Level</h4>
              ${["all", "Beginner", "Intermediate", "Advanced", "All Levels"].map((l) =>
                radio("level", l, filter.level, l === "all" ? "All levels" : l)).join("")}
            </div>
            <div class="filters__group">
              <h4>Price</h4>
              ${radio("price", "all", filter.price, "All")}
              ${radio("price", "paid", filter.price, "Paid")}
              ${radio("price", "free", filter.price, "Free")}
            </div>
            <div class="filters__group">
              <h4>Rating</h4>
              ${radio("rating", "0", String(filter.minRating), "All ratings")}
              ${radio("rating", "4.5", String(filter.minRating), "4.5 &amp; up")}
              ${radio("rating", "4", String(filter.minRating), "4.0 &amp; up")}
            </div>
            <button class="btn btn-outline btn-block btn-sm" data-action="clear-filters" style="margin-top:10px">Reset filters</button>
          </aside>
          <div>
            <div class="catalog__toolbar">
              <button class="btn btn-outline btn-sm filters-toggle" data-action="open-filters"><i data-lucide="sliders-horizontal"></i> Filters</button>
              <span class="muted">${list.length} result${list.length !== 1 ? "s" : ""}</span>
              <select id="sort">
                <option value="popular" ${filter.sort === "popular" ? "selected" : ""}>Most popular</option>
                <option value="rating" ${filter.sort === "rating" ? "selected" : ""}>Highest rated</option>
                <option value="newest" ${filter.sort === "newest" ? "selected" : ""}>Newest</option>
                <option value="priceLow" ${filter.sort === "priceLow" ? "selected" : ""}>Price: low to high</option>
                <option value="priceHigh" ${filter.sort === "priceHigh" ? "selected" : ""}>Price: high to low</option>
              </select>
            </div>
            ${list.length ? courseGrid(list) :
              `<div class="empty"><i data-lucide="search-x"></i><h3>No courses found</h3><p>Try adjusting your filters or search.</p></div>`}
          </div>
        </div>
      </div></div>
      <div class="scrim" id="filters-scrim"></div>`;
    },
    mount(root, ctx) {
      const q = { ...(ctx.query || {}) };
      const apply = () => {
        const get = (n) => { const el = root.querySelector(`[name="${n}"]:checked`); return el ? el.value : null; };
        const next = {};
        const cat = get("category"); if (cat && cat !== "all") next.category = cat;
        const lvl = get("level"); if (lvl && lvl !== "all") next.level = lvl;
        const pr = get("price"); if (pr && pr !== "all") next.price = pr;
        const rt = get("rating"); if (rt && rt !== "0") next.rating = rt;
        const sort = root.querySelector("#sort").value; if (sort && sort !== "popular") next.sort = sort;
        if (q.q) next.q = q.q;
        const qs = new URLSearchParams(next).toString();
        location.hash = "#/courses" + (qs ? "?" + qs : "");
      };
      root.querySelectorAll('.filters input[type="radio"]').forEach((r) => r.addEventListener("change", apply));
      root.querySelector("#sort").addEventListener("change", apply);
      const filtersEl = root.querySelector("#filters");
      const scrim = root.querySelector("#filters-scrim");
      const openF = () => { filtersEl.classList.add("open"); scrim.classList.add("open"); };
      const closeF = () => { filtersEl.classList.remove("open"); scrim.classList.remove("open"); };
      root.querySelector('[data-action="open-filters"]').addEventListener("click", openF);
      scrim.addEventListener("click", closeF);
      root.querySelector('[data-action="clear-filters"]').addEventListener("click", () => { location.hash = "#/courses"; });
    },
  };

  /* ════════ COURSE DETAIL ════════ */
  const course = {
    render(ctx) {
      const c = store.getCourse(ctx.params.slug);
      if (!c) return notFound.render();
      const cat = store.getCategory(c.categoryId) || {};
      const inst = store.getInstructor(c.instructorId);
      const enrolled = store.isEnrolled(c.id);
      const inCart = store.inCart(c.id);
      const wished = store.inWishlist(c.id);
      const disc = c.oldPrice ? Math.round((1 - c.price / c.oldPrice) * 100) : 0;
      const totalLectures = store.lectureKeys(c).length;
      const bd = store.ratingBreakdown(c);
      const related = store.relatedCourses(c, 3);
      const canReview = enrolled && !store.hasReviewed(c.id);

      const buyActions = enrolled
        ? `<a class="btn btn-primary btn-block btn-lg" href="#/learn/${c.slug}"><i data-lucide="play"></i> Go to course</a>
           <a class="btn btn-outline btn-block" href="#/my-courses">My courses</a>`
        : `${inCart
            ? `<a class="btn btn-primary btn-block btn-lg" href="#/cart"><i data-lucide="shopping-cart"></i> Go to cart</a>`
            : `<button class="btn btn-primary btn-block btn-lg" data-action="add-cart" data-id="${c.id}"><i data-lucide="shopping-cart"></i> Add to cart</button>`}
           <button class="btn btn-dark btn-block" data-action="buy-now" data-id="${c.id}">Buy now</button>
           <button class="btn btn-outline btn-block" data-action="toggle-wishlist" data-id="${c.id}">
             <i data-lucide="heart"></i> ${wished ? "Wishlisted" : "Add to wishlist"}</button>`;

      return `
      <section class="detail-hero"><div class="container"><div class="detail-hero__inner">
        <div>
          <div class="breadcrumb" style="color:#94a3b8"><a href="#/">Home</a> / <a href="#/courses">Courses</a> /
            <a href="#/courses?category=${c.categoryId}" class="detail-hero__cat">${esc(cat.name || "")}</a></div>
          <h1>${esc(c.title)}</h1>
          <p class="sub">${esc(c.subtitle)}</p>
          <div class="detail-hero__meta" style="margin-top:14px">
            ${ui.ratingLine(c)}
            <span><i data-lucide="users"></i> ${num(c.students)} students</span>
          </div>
          <div class="detail-hero__meta">
            <span><i data-lucide="user"></i> Created by <b style="color:#fff">&nbsp;${esc(inst.name)}</b></span>
            <span><i data-lucide="refresh-cw"></i> Updated ${esc(c.updated)}</span>
            <span><i data-lucide="globe"></i> ${esc(c.language)}</span>
            <span><i data-lucide="bar-chart-2"></i> ${esc(c.level)}</span>
          </div>
        </div>
        <div></div>
      </div></div></section>

      <div class="container"><div class="detail-wrap">
        <div class="detail-main">
          <div class="panel">
            <h2>What you'll learn</h2>
            <ul class="learn-grid">
              ${c.whatYouLearn.map((x) => `<li><i data-lucide="check"></i><span>${esc(x)}</span></li>`).join("")}
            </ul>
          </div>

          <div class="panel">
            <h2>Course content</h2>
            <p class="muted" style="margin:-8px 0 16px;font-size:.88rem">
              ${c.curriculum.length} sections · ${totalLectures} lectures · ${c.hours}h total</p>
            <div class="accordion">
              ${c.curriculum.map((s, si) => `
                <div class="accordion__item ${si === 0 ? "open" : ""}">
                  <button class="accordion__head" data-action="toggle-accordion">
                    <i data-lucide="chevron-down" class="chev"></i>
                    <span>${esc(s.title)}</span>
                    <small>${s.lectures.length} lectures</small>
                  </button>
                  <div class="accordion__body">
                    ${s.lectures.map((l) => `
                      <div class="lecture">
                        <i data-lucide="${l.preview ? "play-circle" : "lock"}" class="play"></i>
                        <span>${esc(l.title)}</span>
                        ${l.preview ? `<button class="preview-link" data-action="play-preview" data-id="${c.id}">Preview</button>` : ""}
                        <span class="dur">${esc(l.duration)}</span>
                      </div>`).join("")}
                  </div>
                </div>`).join("")}
            </div>
          </div>

          <div class="panel">
            <h2>Requirements</h2>
            <ul class="req-list">
              ${c.requirements.map((r) => `<li><i data-lucide="dot"></i><span>${esc(r)}</span></li>`).join("")}
            </ul>
          </div>

          <div class="panel">
            <h2>Description</h2>
            <p>${esc(c.subtitle)}</p>
            <p style="margin-top:12px">This course is part of the SRUTAM Learn library and is designed for ${esc((c.level || "all").toLowerCase())} learners. You'll work through ${c.curriculum.length} structured sections with ${totalLectures} lectures, hands-on projects and downloadable resources — all built to help you apply what you learn immediately. On completion you'll earn a shareable certificate.</p>
          </div>

          <div class="panel">
            <h2>Instructor</h2>
            <div class="instructor">
              <a href="#/instructor/${c.instructorId}"><img class="avatar" src="${ui.avatar(inst.name, 120)}" alt="${esc(inst.name)}"></a>
              <div>
                <h3 style="margin-bottom:2px"><a href="#/instructor/${c.instructorId}" style="color:var(--primary)">${esc(inst.name)}</a></h3>
                <div class="muted">${esc(inst.title || "")}</div>
                <div class="instructor__meta">
                  <span><i data-lucide="star"></i> ${(inst.rating || 4.6).toFixed(1)} rating</span>
                  <span><i data-lucide="users"></i> ${num(inst.students || 0)} students</span>
                  <span><i data-lucide="play-circle"></i> ${inst.courses || 1} courses</span>
                </div>
                <a class="btn btn-outline btn-sm" href="#/instructor/${c.instructorId}" style="margin-top:10px">View full profile</a>
              </div>
            </div>
          </div>

          <div class="panel">
            <h2>Student feedback</h2>
            <div class="rating-summary">
              <div class="rating-big">
                <b>${c.rating.toFixed(1)}</b>
                ${ui.stars(c.rating)}
                <span class="muted">${num(c.ratingsCount)} ratings</span>
              </div>
              <div class="rating-bars">
                ${bd.map((b) => `<div class="rbar">
                  <span class="rbar__stars">${ui.stars(b.star)}</span>
                  <div class="rbar__track"><div class="rbar__fill" style="width:${b.pct}%"></div></div>
                  <span class="rbar__pct">${b.pct}%</span></div>`).join("")}
              </div>
            </div>

            ${canReview ? `
            <form class="review-form" id="review-form">
              <h3 style="font-size:1.05rem;margin-bottom:10px">Leave a review</h3>
              <div class="star-input" id="star-input">
                ${[1, 2, 3, 4, 5].map((s) => `<button type="button" class="star-btn" data-v="${s}" aria-label="${s} star"><i data-lucide="star"></i></button>`).join("")}
              </div>
              <input type="hidden" name="rating" value="5">
              <textarea name="text" rows="3" placeholder="Share what you thought of this course..."></textarea>
              <button class="btn btn-primary btn-sm" type="submit" style="margin-top:10px">Submit review</button>
            </form>` : (enrolled ? `<p class="muted" style="margin:8px 0 4px"><i data-lucide="check-circle" style="width:15px;height:15px;vertical-align:-2px;color:var(--success)"></i> Thanks — you've reviewed this course.</p>` : "")}

            <div style="margin-top:18px">
            ${(c.reviews || []).map((r) => `
              <div class="review">
                <img class="avatar" src="${ui.avatar(r.user, 80)}" alt="">
                <div class="review__body">
                  <strong>${esc(r.user)}</strong>${r.self ? ' <span class="pill pill-blue" style="font-size:.68rem">You</span>' : ""}<span class="date">${esc(r.date)}</span>
                  <div>${ui.stars(r.rating)}</div>
                  <p>${esc(r.text)}</p>
                </div>
              </div>`).join("")}
            </div>
          </div>
        </div>

        <aside class="detail-side">
          <div class="buy-card">
            <button class="buy-card__media" data-action="play-preview" data-id="${c.id}" style="display:block;width:100%">
              ${ui.courseImg(c)}
              <span class="buy-card__play"><span><i data-lucide="play"></i></span></span>
            </button>
            <div class="buy-card__body">
              <div class="price"><span class="price__now ${c.price === 0 ? "price__free" : ""}">${money(c.price)}</span>
                ${c.oldPrice ? `<span class="price__old">${money(c.oldPrice)}</span>` : ""}</div>
              ${disc ? `<div class="buy-card__disc">${disc}% off · limited time</div>` : "<div style='height:8px'></div>"}
              <div class="buy-card__actions">${buyActions}</div>
              <p class="muted center" style="font-size:.8rem;margin-bottom:14px">30-Day Money-Back Guarantee</p>
              <strong style="display:block;margin-bottom:8px">This course includes:</strong>
              <ul class="buy-card__includes">
                <li><i data-lucide="monitor-play"></i> ${c.hours} hours on-demand video</li>
                <li><i data-lucide="file-text"></i> ${c.articles} articles</li>
                <li><i data-lucide="download"></i> ${c.resources} downloadable resources</li>
                <li><i data-lucide="smartphone"></i> Access on mobile and TV</li>
                <li><i data-lucide="infinity"></i> Full lifetime access</li>
                <li><i data-lucide="award"></i> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </aside>
      </div></div>

      ${related.length ? `<div class="container"><section class="section" style="padding:6px 0 50px">
        <h2 class="section-title" style="margin-bottom:18px">Students also bought</h2>
        ${courseGrid(related)}
      </section></div>` : ""}`;
    },
    mount(root, ctx) {
      const c = store.getCourse(ctx.params.slug);
      if (!c) return;
      const stars = root.querySelectorAll(".star-btn");
      const hidden = root.querySelector('input[name="rating"]');
      const paint = (v) => stars.forEach((b) => b.classList.toggle("on", +b.dataset.v <= v));
      if (stars.length && hidden) {
        paint(5);
        stars.forEach((b) => {
          b.addEventListener("mouseenter", () => paint(+b.dataset.v));
          b.addEventListener("click", () => { hidden.value = b.dataset.v; paint(+b.dataset.v); });
        });
        const wrap = root.querySelector("#star-input");
        if (wrap) wrap.addEventListener("mouseleave", () => paint(+hidden.value));
      }
      const form = root.querySelector("#review-form");
      if (form) form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const res = store.addReview(c.id, { rating: fd.get("rating"), text: fd.get("text") });
        if (res.ok) { ui.toast("Thanks for your review!"); App.router.reload(); }
        else ui.toast(res.error, "error");
      });
    },
  };

  /* ════════ PLAYER ════════ */
  function getLecture(c, key) {
    const [si, li] = key.split("-").map(Number);
    const s = c.curriculum[si]; if (!s) return null;
    const l = s.lectures[li]; if (!l) return null;
    return { section: s, lecture: l, si, li };
  }
  const player = {
    render(ctx) {
      const c = store.getCourse(ctx.params.slug);
      if (!c) return notFound.render();
      if (!store.isLoggedIn()) return needLogin("Sign in to access your course player.", "/learn/" + c.slug);
      if (!store.isEnrolled(c.id)) {
        return `<div class="page"><div class="container"><div class="empty" style="max-width:480px;margin:0 auto">
          <i data-lucide="lock"></i><h2>You're not enrolled yet</h2>
          <p style="margin-bottom:18px">Enrol in “${esc(c.title)}” to start learning.</p>
          <a class="btn btn-primary" href="#/course/${c.slug}">View course</a></div></div></div>`;
      }
      const keys = store.lectureKeys(c);
      const curKey = (ctx.query && ctx.query.l && keys.includes(ctx.query.l)) ? ctx.query.l : keys[0];
      const cur = getLecture(c, curKey);
      const done = store.completed(c.id);
      const notes = store.notesFor(c.id);
      const noteLabel = (k) => { const g = getLecture(c, k); return g ? g.lecture.title : "General"; };
      const pct = store.progressPct(c.id);
      const idx = keys.indexOf(curKey);
      const prevKey = keys[idx - 1], nextKey = keys[idx + 1];

      return `<div class="player" data-course="${c.id}">
        <div class="player__main">
          <div class="player__video">
            <video id="lesson-video" controls autoplay playsinline poster="${esc(c.image || ui.fallbackSVG(c))}">
              <source src="${App.seed.sampleVideo}" type="video/mp4"></video>
          </div>
          <div class="player__info">
            <div class="crumbs"><a href="#/my-courses">My Courses</a> / <a href="#/course/${c.slug}">${esc(c.title)}</a></div>
            <h1 id="now-title">${esc(cur.lecture.title)}</h1>
            <div class="muted" style="color:#94a3b8">${esc(cur.section.title)} · ${esc(cur.lecture.duration)}</div>
            <div class="player__actions">
              ${prevKey ? `<a class="btn btn-outline btn-sm" href="#/learn/${c.slug}?l=${prevKey}"><i data-lucide="chevron-left"></i> Previous</a>` : ""}
              <button class="btn btn-primary btn-sm" data-action="complete-next" data-course="${c.id}" data-key="${curKey}" ${nextKey ? `data-next="${nextKey}"` : ""}>
                <i data-lucide="check"></i> Mark complete ${nextKey ? "& next" : ""}</button>
              ${nextKey ? `<a class="btn btn-outline btn-sm" href="#/learn/${c.slug}?l=${nextKey}">Next <i data-lucide="chevron-right"></i></a>` : ""}
            </div>
          </div>
          <div class="player-notes">
            <h3><i data-lucide="sticky-note"></i> My notes</h3>
            <form id="note-form">
              <textarea name="text" rows="2" placeholder="Add a note for &ldquo;${esc(cur.lecture.title)}&rdquo;..."></textarea>
              <button class="btn btn-primary btn-sm" type="submit">Add note</button>
            </form>
            <div class="note-list">
              ${notes.length ? notes.map((n) => `<div class="note-item">
                <div class="note-item__body"><p>${esc(n.text)}</p><span class="muted">${esc(noteLabel(n.lectureKey))} · ${esc(n.date)}</span></div>
                <button class="icon-action danger" data-action="delete-note" data-course="${c.id}" data-id="${n.id}" title="Delete note"><i data-lucide="trash-2"></i></button>
              </div>`).join("") : '<p class="muted" style="font-size:.88rem">No notes yet — jot down key takeaways as you learn.</p>'}
            </div>
          </div>
        </div>
        <div class="player__side">
          <h3>Course content <span class="muted" id="lec-count" style="font-size:.8rem">${done.length}/${keys.length}</span></h3>
          <div class="player-progress">
            <div class="muted" style="font-size:.82rem;margin-bottom:6px"><b id="pct-label">${pct}%</b> complete</div>
            <div class="progress-bar"><i id="pct-bar" style="width:${pct}%"></i></div>
          </div>
          ${c.curriculum.map((s, si) => `
            <div class="player-section">
              <div class="player-section__head">${esc(s.title)}</div>
              ${s.lectures.map((l, li) => {
                const k = si + "-" + li;
                const isDone = done.includes(k);
                return `<div class="player-lecture ${k === curKey ? "active" : ""} ${isDone ? "done" : ""}" data-key="${k}">
                  <input type="checkbox" ${isDone ? "checked" : ""} data-action="toggle-lecture" data-course="${c.id}" data-key="${k}" title="Mark complete">
                  <a class="l-title" href="#/learn/${c.slug}?l=${k}">${esc(l.title)}</a>
                  <span class="l-dur">${esc(l.duration)}</span>
                </div>`;
              }).join("")}
            </div>`).join("")}
        </div>
      </div>`;
    },
    mount(root, ctx) {
      const c = store.getCourse(ctx.params.slug);
      if (!c || !store.isEnrolled(c.id)) return;
      const keys = store.lectureKeys(c);
      const curKey = (ctx.query && ctx.query.l && keys.includes(ctx.query.l)) ? ctx.query.l : keys[0];
      const form = root.querySelector("#note-form");
      if (form) form.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = new FormData(form).get("text");
        if (!(text || "").trim()) return;
        store.addNote(c.id, { lectureKey: curKey, text });
        ui.toast("Note saved"); App.router.reload();
      });
    },
  };

  /* ════════ DASHBOARD ════════ */
  const dashboard = {
    render() {
      const u = store.currentUser();
      if (!u) return needLogin("Sign in to view your dashboard.", "/dashboard");
      const enrolled = store.myCourses();
      const inProgress = enrolled.filter((c) => { const p = store.progressPct(c.id); return p > 0 && p < 100; });
      const completed = enrolled.filter((c) => store.progressPct(c.id) === 100);
      const totalHours = enrolled.reduce((s, c) => s + c.hours, 0);
      const recommend = store.queryCourses({ sort: "popular" }).filter((c) => !store.isEnrolled(c.id)).slice(0, 3);

      const stat = (icon, color, val, label) =>
        `<div class="stat-card"><div class="stat-card__icon" style="background:${color}"><i data-lucide="${icon}"></i></div>
          <b>${val}</b><span>${label}</span></div>`;

      const continueList = enrolled.length ? enrolled.map((c) => {
        const p = store.progressPct(c.id);
        return `<div class="learn-row">
          ${ui.courseImg(c)}
          <div class="learn-row__info">
            <strong>${esc(c.title)}</strong>
            <div class="pct">${p}% complete</div>
            <div class="progress-bar"><i style="width:${p}%"></i></div>
          </div>
          ${p === 100
            ? `<a class="btn btn-outline btn-sm" href="#/certificate/${c.slug}"><i data-lucide="award"></i> Certificate</a>`
            : `<a class="btn btn-primary btn-sm" href="#/learn/${c.slug}">${p > 0 ? "Resume" : "Start"}</a>`}
        </div>`;
      }).join("") : `<div class="empty"><i data-lucide="book-open"></i><p>You haven't enrolled in any courses yet.</p>
          <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:10px">Browse courses</a></div>`;

      return `<div class="page"><div class="container">
        <div class="page__head"><h1>Welcome back, ${esc(u.name.split(" ")[0])} 👋</h1>
          <p>Pick up where you left off and keep building your skills.</p></div>
        <div class="stat-cards">
          ${stat("book-open", "#0178CF", enrolled.length, "Enrolled courses")}
          ${stat("loader", "#7C3AED", inProgress.length, "In progress")}
          ${stat("badge-check", "#10b981", completed.length, "Completed")}
          ${stat("clock", "#f59e0b", totalHours + "h", "Hours of content")}
        </div>
        <div class="dash-grid">
          <div class="card">
            <div class="card__head"><h3>Continue learning</h3><a class="btn btn-ghost btn-sm" href="#/my-courses">View all</a></div>
            ${continueList}
          </div>
          <div>
            <div class="card" style="margin-bottom:24px">
              <div class="card__head"><h3>Recommended for you</h3></div>
              ${recommend.length ? recommend.map((c) => `
                <div class="learn-row">
                  ${ui.courseImg(c)}
                  <div class="learn-row__info"><strong>${esc(c.title)}</strong>
                    <div class="pct">${ui.money(c.price)} · ${c.rating.toFixed(1)}★</div></div>
                  <a class="btn btn-outline btn-sm" href="#/course/${c.slug}">View</a>
                </div>`).join("") : `<p class="muted">You're enrolled in everything — nice!</p>`}
            </div>
            <div class="card">
              <div class="card__head"><h3>Account</h3></div>
              <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                <img class="avatar" style="width:54px;height:54px" src="${ui.avatar(u.avatarSeed || u.name, 108)}" alt="">
                <div><strong>${esc(u.name)}</strong><div class="muted" style="font-size:.85rem">${esc(u.email)}</div></div>
              </div>
              <div class="muted" style="font-size:.85rem">Member since ${esc(u.joined)}</div>
              <button class="btn btn-outline btn-block btn-sm" data-action="logout" style="margin-top:14px"><i data-lucide="log-out"></i> Log out</button>
            </div>
          </div>
        </div>
      </div></div>`;
    },
  };

  /* ════════ MY COURSES ════════ */
  const myCourses = {
    render() {
      if (!store.isLoggedIn()) return needLogin("Sign in to see the courses you're enrolled in.", "/my-courses");
      const list = store.myCourses();
      if (!list.length) return `<div class="page"><div class="container">
        <div class="page__head"><h1>My Courses</h1></div>
        <div class="empty"><i data-lucide="book-open"></i><h3>No courses yet</h3>
          <p>When you enrol in a course it will appear here.</p>
          <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Find a course</a></div></div></div>`;
      return `<div class="page"><div class="container">
        <div class="page__head"><h1>My Courses</h1><p>${list.length} course${list.length !== 1 ? "s" : ""} · keep going!</p></div>
        <div class="course-grid">
          ${list.map((c) => {
            const p = store.progressPct(c.id);
            return `<div class="course-card">
              <a class="course-card__thumb" href="#/learn/${c.slug}">${ui.courseImg(c)}</a>
              <div class="course-card__body">
                <h3 class="course-card__title">${esc(c.title)}</h3>
                <div class="course-card__inst">${esc(store.getInstructor(c.instructorId).name)}</div>
                <div class="pct muted" style="font-size:.8rem;margin-top:4px">${p}% complete</div>
                <div class="progress-bar"><i style="width:${p}%"></i></div>
                <div class="course-card__foot">
                  <a class="btn btn-primary btn-sm btn-block" href="#/learn/${c.slug}">${p > 0 ? "Continue" : "Start learning"}</a>
                </div>
              </div></div>`;
          }).join("")}
        </div>
      </div></div>`;
    },
  };

  /* ════════ WISHLIST ════════ */
  const wishlist = {
    render() {
      const list = store.wishlistCourses();
      return `<div class="page"><div class="container">
        <div class="page__head"><h1>My Wishlist</h1><p>${list.length} saved course${list.length !== 1 ? "s" : ""}</p></div>
        ${list.length ? courseGrid(list) :
          `<div class="empty"><i data-lucide="heart"></i><h3>Your wishlist is empty</h3>
            <p>Tap the heart on any course to save it for later.</p>
            <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Browse courses</a></div>`}
      </div></div>`;
    },
  };

  /* ════════ CART ════════ */
  const cart = {
    render() {
      const items = store.cartCourses();
      const total = store.cartTotal(), old = store.cartOldTotal();
      const saved = old - total;
      const coupon = store.getCoupon();
      const discount = store.couponDiscount(total);
      const payable = +(total - discount).toFixed(2);
      if (!items.length) return `<div class="page"><div class="container">
        <div class="page__head"><h1>Shopping Cart</h1></div>
        <div class="empty"><i data-lucide="shopping-cart"></i><h3>Your cart is empty</h3>
          <p>Keep exploring to find your next course.</p>
          <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Browse courses</a></div></div></div>`;
      return `<div class="page"><div class="container">
        <div class="page__head"><h1>Shopping Cart</h1><p>${items.length} course${items.length !== 1 ? "s" : ""} in cart</p></div>
        <div class="cart-layout">
          <div>
            ${items.map((c) => `<div class="cart-item">
              <a href="#/course/${c.slug}">${ui.courseImg(c)}</a>
              <div class="cart-item__info">
                <h4><a href="#/course/${c.slug}">${esc(c.title)}</a></h4>
                <div class="muted" style="font-size:.85rem">By ${esc(store.getInstructor(c.instructorId).name)}</div>
                <div style="margin-top:4px">${ui.ratingLine(c)}</div>
                <div class="cart-item__actions">
                  <button class="rm" data-action="remove-cart" data-id="${c.id}"><i data-lucide="trash-2" style="width:14px;height:14px;vertical-align:-2px"></i> Remove</button>
                  <button data-action="move-wishlist" data-id="${c.id}">Move to wishlist</button>
                </div>
              </div>
              <div class="price" style="flex-direction:column;align-items:flex-end">
                <span class="price__now">${ui.money(c.price)}</span>
                ${c.oldPrice ? `<span class="price__old">${ui.money(c.oldPrice)}</span>` : ""}
              </div>
            </div>`).join("")}
          </div>
          <aside class="summary">
            <h3>Summary</h3>
            <div class="summary__total">${ui.money(payable)}</div>
            ${saved > 0 ? `<div class="muted" style="font-size:.85rem"><s>${ui.money(old)}</s> · ${Math.round((saved / old) * 100)}% off</div>` : ""}
            <form class="coupon" id="coupon-form">
              <input name="code" placeholder="Coupon code" value="${coupon ? esc(coupon.code) : ""}" aria-label="Coupon code">
              <button class="btn btn-outline btn-sm" type="submit">Apply</button>
            </form>
            ${coupon
              ? `<div class="summary__row" style="align-items:center"><span style="color:var(--success)"><i data-lucide="badge-percent" style="width:14px;height:14px;vertical-align:-2px"></i> ${esc(coupon.code)} applied</span><button data-action="remove-coupon" style="color:var(--danger);font-weight:600;font-size:.8rem">Remove</button></div>`
              : `<p class="muted" style="font-size:.76rem;margin:-2px 0 8px">Try <b>SRUTAM50</b>, <b>WELCOME20</b> or <b>LEARN10</b></p>`}
            <div class="summary__row"><span>Subtotal</span><span>${ui.money(total)}</span></div>
            ${discount > 0 ? `<div class="summary__row"><span>Discount</span><span style="color:var(--success)">-${ui.money(discount)}</span></div>` : ""}
            <div class="summary__row line"><span>Total</span><span>${ui.money(payable)}</span></div>
            <a class="btn btn-primary btn-block btn-lg" href="#/checkout" style="margin-top:14px">Checkout</a>
            <p class="muted center" style="font-size:.78rem;margin-top:10px">Demo checkout — no real payment.</p>
          </aside>
        </div>
      </div></div>`;
    },
    mount(root) {
      const form = root.querySelector("#coupon-form");
      if (form) form.addEventListener("submit", (e) => {
        e.preventDefault();
        const res = store.applyCoupon(new FormData(form).get("code"));
        if (res.ok) { ui.toast(`Coupon applied — ${res.coupon.label}`); App.router.reload(); }
        else ui.toast(res.error, "error");
      });
    },
  };

  /* ════════ CHECKOUT ════════ */
  const checkout = {
    render() {
      if (!store.isLoggedIn()) return needLogin("Sign in to complete your enrolment.", "/checkout");
      const items = store.cartCourses();
      const total = store.cartTotal(), old = store.cartOldTotal();
      const coupon = store.getCoupon();
      const couponDisc = store.couponDiscount(total);
      const payable = +(total - couponDisc).toFixed(2);
      const u = store.currentUser();
      if (!items.length) return `<div class="page"><div class="container">
        <div class="page__head"><h1>Checkout</h1></div>
        <div class="empty"><i data-lucide="shopping-cart"></i><h3>Your cart is empty</h3>
          <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Browse courses</a></div></div></div>`;
      return `<div class="page"><div class="container">
        <div class="breadcrumb"><a href="#/cart">Cart</a> / <span>Checkout</span></div>
        <div class="page__head"><h1>Checkout</h1></div>
        <div class="cart-layout">
          <form class="card" id="checkout-form">
            <div class="form-ok"><i data-lucide="info" style="width:15px;height:15px;vertical-align:-2px"></i> This is a demo. No real payment is processed and no card data is stored.</div>
            <h3 style="margin-bottom:14px">Billing details</h3>
            <div class="field"><label>Full name</label><input name="name" value="${esc(u.name)}" required></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${esc(u.email)}" required></div>
            <h3 style="margin:18px 0 14px">Payment</h3>
            <div class="field"><label>Card number</label><input name="card" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div class="field"><label>Expiry</label><input name="exp" placeholder="MM/YY" value="12/29"></div>
              <div class="field"><label>CVC</label><input name="cvc" placeholder="123" value="123"></div>
            </div>
            <button class="btn btn-primary btn-block btn-lg" type="submit" style="margin-top:8px"><i data-lucide="lock"></i> Place order — ${ui.money(payable)}</button>
          </form>
          <aside class="summary">
            <h3>Order summary</h3>
            <div style="margin:10px 0">
              ${items.map((c) => `<div class="summary__row"><span style="max-width:200px">${esc(c.title)}</span><b>${ui.money(c.price)}</b></div>`).join("")}
            </div>
            ${old > total ? `<div class="summary__row"><span>Original price</span><s>${ui.money(old)}</s></div>
              <div class="summary__row"><span>Course discount</span><span style="color:var(--success)">-${ui.money(old - total)}</span></div>` : ""}
            ${coupon ? `<div class="summary__row"><span>Coupon ${esc(coupon.code)}</span><span style="color:var(--success)">-${ui.money(couponDisc)}</span></div>` : ""}
            <div class="summary__row line"><span>Total</span><span>${ui.money(payable)}</span></div>
          </aside>
        </div>
      </div></div>`;
    },
    mount(root) {
      const form = root.querySelector("#checkout-form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const res = store.checkout();
        if (res.ok) { ui.toast(`Order ${res.orderId} confirmed — enrolled in ${res.count} course${res.count !== 1 ? "s" : ""}! 🎉`); ui.go("/my-courses"); }
        else ui.toast(res.error, "error");
      });
    },
  };

  /* ════════ AUTH ════════ */
  const authAside = (title, sub) => `<div class="auth-aside">
    <h2>${title}</h2><p>${sub}</p>
    ${[["check-circle", "Access 6+ expert-led courses"], ["check-circle", "Learn on desktop, tablet & mobile"],
       ["check-circle", "Track progress & earn certificates"], ["check-circle", "Wishlist and revisit anytime"]]
      .map(([i, t]) => `<div class="pt"><i data-lucide="${i}"></i> ${t}</div>`).join("")}</div>`;

  const login = {
    render(ctx) {
      const next = (ctx.query && ctx.query.next) || "/dashboard";
      return `<div class="auth-wrap">
        ${authAside("Welcome back", "Log in to continue learning and pick up right where you left off.")}
        <div class="auth-main"><div class="auth-box">
          <h1>Log in to SRUTAM Learn</h1><p class="sub">Enter your details below.</p>
          <form id="login-form" data-next="${esc(next)}">
            <div class="form-error" id="login-err" hidden></div>
            <div class="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" required></div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="••••••••" required></div>
            <button class="btn btn-primary btn-block btn-lg" type="submit">Log in</button>
          </form>
          <div class="demo-creds">Demo learner — <b>student@demo.com</b> / <b>demo1234</b><br>
            Admin panel — <a href="#/admin/login" style="color:var(--primary);font-weight:700">go to admin login</a></div>
          <div class="auth-switch">New here? <a href="#/register">Create an account</a></div>
        </div></div>
      </div>`;
    },
    mount(root) {
      const form = root.querySelector("#login-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const res = store.login(fd.get("email"), fd.get("password"));
        if (res.ok) { ui.toast(`Welcome back, ${res.user.name.split(" ")[0]}!`); ui.go(form.dataset.next || "/dashboard"); }
        else { const el = root.querySelector("#login-err"); el.textContent = res.error; el.hidden = false; }
      });
    },
  };

  const register = {
    render(ctx) {
      const next = (ctx.query && ctx.query.next) || "/dashboard";
      return `<div class="auth-wrap">
        ${authAside("Start learning today", "Create your free account and unlock a library of professional courses.")}
        <div class="auth-main"><div class="auth-box">
          <h1>Create your account</h1><p class="sub">It's free — no credit card required.</p>
          <form id="reg-form" data-next="${esc(next)}">
            <div class="form-error" id="reg-err" hidden></div>
            <div class="field"><label>Full name</label><input name="name" placeholder="Your name" required></div>
            <div class="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" required></div>
            <div class="field"><label>Password</label><input name="password" type="password" placeholder="At least 6 characters" required>
              <div class="hint">Use 6+ characters.</div></div>
            <button class="btn btn-primary btn-block btn-lg" type="submit">Create account</button>
          </form>
          <div class="auth-switch">Already have an account? <a href="#/login">Log in</a></div>
        </div></div>
      </div>`;
    },
    mount(root) {
      const form = root.querySelector("#reg-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const res = store.register({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") });
        if (res.ok) { ui.toast(`Welcome to SRUTAM Learn, ${res.user.name.split(" ")[0]}!`); ui.go(form.dataset.next || "/dashboard"); }
        else { const el = root.querySelector("#reg-err"); el.textContent = res.error; el.hidden = false; }
      });
    },
  };

  /* ════════ INSTRUCTOR PROFILE ════════ */
  const instructor = {
    render(ctx) {
      const inst = App.seed.instructors.find((i) => i.id === ctx.params.id);
      if (!inst) return notFound.render();
      const list = store.coursesByInstructor(inst.id);
      const totalStudents = list.reduce((s, c) => s + c.students, 0);
      return `
      <section class="detail-hero"><div class="container" style="padding:36px 0">
        <div class="breadcrumb" style="color:#94a3b8"><a href="#/">Home</a> / <span>Instructor</span></div>
        <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
          <img class="avatar" style="width:108px;height:108px" src="${ui.avatar(inst.name, 160)}" alt="">
          <div>
            <h1>${esc(inst.name)}</h1>
            <p class="sub">${esc(inst.title || "")}</p>
            <div class="detail-hero__meta" style="margin-top:12px">
              <span><i data-lucide="star"></i> ${(inst.rating || 4.6).toFixed(1)} instructor rating</span>
              <span><i data-lucide="users"></i> ${num(totalStudents)} students</span>
              <span><i data-lucide="play-circle"></i> ${list.length} course${list.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div></section>
      <div class="page"><div class="container">
        <div class="panel" style="margin-bottom:24px"><h2>About ${esc(inst.name.split(" ")[0])}</h2>
          <p>${esc(inst.name)} is a ${esc((inst.title || "expert").toLowerCase())} teaching on SRUTAM Learn, helping ${num(totalStudents)} learners build practical, job-ready skills through clear, hands-on instruction and real-world projects.</p></div>
        <h2 class="section-title" style="margin-bottom:18px">Courses by ${esc(inst.name)}</h2>
        ${courseGrid(list)}
      </div></div>`;
    },
  };

  /* ════════ CATEGORY LANDING ════════ */
  const category = {
    render(ctx) {
      const cat = store.getCategory(ctx.params.id);
      if (!cat) return notFound.render();
      const list = store.queryCourses({ category: cat.id });
      return `
      <section class="hero" style="background:linear-gradient(135deg,${cat.color},#0d1117)"><div class="container">
        <div style="padding:46px 0">
          <div class="breadcrumb" style="color:rgba(255,255,255,.8)"><a href="#/">Home</a> / <a href="#/courses">Courses</a> / <span>${esc(cat.name)}</span></div>
          <span class="hero__eyebrow"><i data-lucide="${cat.icon}"></i> Category</span>
          <h1>${esc(cat.name)}</h1>
          <p class="lead">${list.length} course${list.length !== 1 ? "s" : ""} to help you master ${esc(cat.name.toLowerCase())}.</p>
        </div>
      </div></section>
      <div class="page"><div class="container">
        ${list.length ? courseGrid(list) :
          `<div class="empty"><i data-lucide="search-x"></i><h3>No courses in this category yet</h3>
            <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Browse all courses</a></div>`}
      </div></div>`;
    },
  };

  /* ════════ CERTIFICATE ════════ */
  const certificate = {
    render(ctx) {
      const c = store.getCourse(ctx.params.slug);
      if (!c) return notFound.render();
      if (!store.isLoggedIn()) return needLogin("Sign in to view your certificate.", "/certificate/" + c.slug);
      if (!store.isEnrolled(c.id)) return `<div class="page"><div class="container"><div class="empty" style="max-width:480px;margin:0 auto">
        <i data-lucide="award"></i><h2>Not enrolled</h2><p style="margin-bottom:16px">Enrol and complete this course to earn a certificate.</p>
        <a class="btn btn-primary" href="#/course/${c.slug}">View course</a></div></div></div>`;
      const pct = store.progressPct(c.id);
      if (pct < 100) return `<div class="page"><div class="container"><div class="empty" style="max-width:520px;margin:0 auto">
        <i data-lucide="award"></i><h2>Almost there!</h2>
        <p style="margin-bottom:14px">Complete the course to unlock your certificate — you're at <b>${pct}%</b>.</p>
        <div class="progress-bar" style="max-width:320px;margin:0 auto 18px"><i style="width:${pct}%"></i></div>
        <a class="btn btn-primary" href="#/learn/${c.slug}">Continue learning</a></div></div></div>`;
      const cert = store.certificateData(c.id);
      const inst = store.getInstructor(c.instructorId);
      return `<div class="page"><div class="container">
        <div class="breadcrumb"><a href="#/my-courses">My Courses</a> / <span>Certificate</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
          <h1>Certificate of Completion</h1>
          <button class="btn btn-outline" onclick="window.print()"><i data-lucide="printer"></i> Print / Save as PDF</button>
        </div>
        <div class="certificate" id="cert">
          <div class="certificate__inner">
            <div class="certificate__head">
              <img src="assets/logo.png" alt="SRUTAM Learn" class="certificate__logo">
              <span class="certificate__seal"><i data-lucide="award"></i></span>
            </div>
            <p class="certificate__eyebrow">Certificate of Completion</p>
            <p class="certificate__pre">This certifies that</p>
            <h2 class="certificate__name">${esc(cert.user.name)}</h2>
            <p class="certificate__pre">has successfully completed the online course</p>
            <h3 class="certificate__course">${esc(c.title)}</h3>
            <p class="muted certificate__hours">${c.hours} hours · ${store.lectureKeys(c).length} lectures</p>
            <div class="certificate__foot">
              <div><b>${esc(cert.date)}</b><span>Date completed</span></div>
              <div><b>${esc(inst.name)}</b><span>Instructor</span></div>
              <div><b>${esc(cert.id)}</b><span>Certificate ID</span></div>
            </div>
          </div>
        </div>
      </div></div>`;
    },
  };

  /* ════════ PROFILE / SETTINGS ════════ */
  const profile = {
    render() {
      const u = store.currentUser();
      if (!u) return needLogin("Sign in to manage your profile.", "/profile");
      return `<div class="page"><div class="container" style="max-width:660px">
        <div class="page__head"><h1>Profile &amp; settings</h1><p>Update your account details.</p></div>
        <div class="card">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <img class="avatar" style="width:64px;height:64px" src="${ui.avatar(u.avatarSeed || u.name, 128)}" alt="">
            <div><strong style="font-size:1.05rem">${esc(u.name)}</strong><div class="muted" style="font-size:.85rem">Member since ${esc(u.joined)}</div></div>
          </div>
          <form id="profile-form">
            <div class="form-ok" id="prof-ok" hidden>Profile updated successfully.</div>
            <div class="form-error" id="prof-err" hidden></div>
            <div class="field"><label>Full name</label><input name="name" value="${esc(u.name)}" required></div>
            <div class="field"><label>Email</label><input name="email" type="email" value="${esc(u.email)}" required></div>
            <div class="field"><label>New password <span class="hint" style="display:inline">(leave blank to keep current)</span></label><input name="password" type="password" placeholder="••••••••"></div>
            <button class="btn btn-primary" type="submit">Save changes</button>
          </form>
        </div>
        <div class="card" style="margin-top:20px">
          <div class="card__head"><h3>Quick links</h3></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn btn-outline btn-sm" href="#/my-courses"><i data-lucide="book-open"></i> My Courses</a>
            <a class="btn btn-outline btn-sm" href="#/orders"><i data-lucide="receipt"></i> Order history</a>
            <a class="btn btn-outline btn-sm" href="#/wishlist"><i data-lucide="heart"></i> Wishlist</a>
            <button class="btn btn-outline btn-sm" data-action="logout"><i data-lucide="log-out"></i> Log out</button>
          </div>
        </div>
      </div></div>`;
    },
    mount(root) {
      const form = root.querySelector("#profile-form");
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const res = store.updateProfile({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") });
        const ok = root.querySelector("#prof-ok"), err = root.querySelector("#prof-err");
        if (res.ok) { ok.hidden = false; err.hidden = true; ui.toast("Profile updated"); }
        else { err.textContent = res.error; err.hidden = false; ok.hidden = true; }
      });
    },
  };

  /* ════════ ORDER HISTORY ════════ */
  const orders = {
    render() {
      if (!store.isLoggedIn()) return needLogin("Sign in to view your orders.", "/orders");
      const list = store.myOrders();
      return `<div class="page"><div class="container">
        <div class="page__head"><h1>Order history</h1><p>${list.length} order${list.length !== 1 ? "s" : ""}</p></div>
        ${list.length ? list.map((o) => `
          <div class="card" style="margin-bottom:16px">
            <div class="card__head" style="margin-bottom:12px">
              <div><strong>${esc(o.id)}</strong><div class="muted" style="font-size:.82rem">${esc(o.date)}${o.coupon ? ` · coupon ${esc(o.coupon)}` : ""}</div></div>
              <div class="price"><span class="price__now">${ui.money(o.total)}</span></div>
            </div>
            ${o.items.map((cid) => { const c = store.getCourse(cid); if (!c) return ""; return `<div class="learn-row" style="padding:10px 0">
              ${ui.courseImg(c)}
              <div class="learn-row__info"><strong>${esc(c.title)}</strong><div class="muted" style="font-size:.8rem">${esc(store.getInstructor(c.instructorId).name)}</div></div>
              <a class="btn btn-outline btn-sm" href="#/learn/${c.slug}">Open</a>
            </div>`; }).join("")}
            ${o.discount > 0 ? `<div class="summary__row" style="border-top:1px solid var(--gray-100);margin-top:8px;padding-top:10px"><span class="muted">Subtotal ${ui.money(o.subtotal)} · discount -${ui.money(o.discount)}</span><b>${ui.money(o.total)}</b></div>` : ""}
          </div>`).join("") :
          `<div class="empty"><i data-lucide="receipt"></i><h3>No orders yet</h3><p>Your purchases will appear here.</p>
            <a class="btn btn-primary btn-sm" href="#/courses" style="margin-top:12px">Browse courses</a></div>`}
      </div></div>`;
    },
  };

  /* ════════ 404 ════════ */
  const notFound = {
    render() {
      return `<div class="page"><div class="container"><div class="empty" style="max-width:440px;margin:40px auto">
        <i data-lucide="compass"></i><h2>Page not found</h2>
        <p style="margin-bottom:18px">The page you're looking for doesn't exist.</p>
        <a class="btn btn-primary" href="#/">Back to home</a></div></div></div>`;
    },
  };

  return { home, courses, course, player, dashboard, myCourses, wishlist, cart, checkout, login, register, instructor, category, certificate, profile, orders, notFound };
})();
