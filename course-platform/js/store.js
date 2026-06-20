/* ═══════════════════════════════════════════════════════════
   SRUTAM Learn — Store (localStorage state + business logic)
═══════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.store = (function () {
  const KEY = "srutam_learn_v1";
  let state = null;
  const listeners = new Set();

  /* ---------- persistence ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota */ }
    emit();
  }
  function emit() { listeners.forEach((fn) => fn(state)); }
  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  function seedState() {
    const s = App.seed;
    return {
      users: clone(s.users),
      courses: clone(s.courses),
      categories: clone(s.categories),
      enrollments: clone(s.enrollments),
      orders: clone(s.orders || []),
      carts: {},
      wishlists: {},
      progress: {},
      notes: {},
      coupon: {},
      session: null,
      adminSession: false,
    };
  }
  const clone = (x) => JSON.parse(JSON.stringify(x));

  function init() {
    state = load() || seedState();
    // forward-compat: ensure keys exist
    ["carts", "wishlists", "progress", "notes", "coupon"].forEach((k) => { if (!state[k]) state[k] = {}; });
    if (!state.orders) state.orders = [];
    save();
  }

  /* ---------- auth ---------- */
  function currentUser() {
    return state.users.find((u) => u.id === state.session) || null;
  }
  function isAdmin() { return !!state.adminSession; }
  function isLoggedIn() { return !!currentUser(); }

  function register({ name, email, password }) {
    email = (email || "").trim().toLowerCase();
    if (!name || !email || !password) return { ok: false, error: "All fields are required." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (state.users.some((u) => u.email.toLowerCase() === email))
      return { ok: false, error: "An account with this email already exists." };
    const user = {
      id: "u" + Date.now(),
      name: name.trim(), email, password, role: "student",
      joined: new Date().toISOString().slice(0, 10),
      avatarSeed: name.trim(),
    };
    state.users.push(user);
    state.session = user.id;
    mergeGuest(user.id);
    save();
    return { ok: true, user };
  }

  function login(email, password) {
    email = (email || "").trim().toLowerCase();
    const user = state.users.find((u) => u.email.toLowerCase() === email && u.password === password);
    if (!user) return { ok: false, error: "Invalid email or password." };
    state.session = user.id;
    mergeGuest(user.id);
    save();
    return { ok: true, user };
  }

  function logout() { state.session = null; save(); }

  function adminLogin(email, password) {
    const a = App.seed.admin;
    if ((email || "").trim().toLowerCase() === a.email && password === a.password) {
      state.adminSession = true; save(); return { ok: true };
    }
    return { ok: false, error: "Invalid admin credentials." };
  }
  function adminLogout() { state.adminSession = false; save(); }

  // Merge anonymous cart/wishlist into the user account on login
  function mergeGuest(userId) {
    const gCart = state.carts.guest || [];
    const gWish = state.wishlists.guest || [];
    state.carts[userId] = unique([...(state.carts[userId] || []), ...gCart]);
    state.wishlists[userId] = unique([...(state.wishlists[userId] || []), ...gWish]);
    delete state.carts.guest; delete state.wishlists.guest;
  }
  const unique = (a) => [...new Set(a)];
  function bucket() { return state.session || "guest"; }

  /* ---------- lookups ---------- */
  const getCourse = (idOrSlug) => state.courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  const getCategory = (id) => state.categories.find((c) => c.id === id) || null;
  const getInstructor = (id) => App.seed.instructors.find((i) => i.id === id) || { name: "Instructor", title: "" };
  const allCourses = () => state.courses.slice();
  const allCategories = () => state.categories.slice();

  function queryCourses({ q = "", category = "all", level = "all", price = "all", minRating = 0, sort = "popular" } = {}) {
    let list = state.courses.slice();
    if (q) {
      const t = q.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(t) ||
        c.subtitle.toLowerCase().includes(t) ||
        getInstructor(c.instructorId).name.toLowerCase().includes(t) ||
        (getCategory(c.categoryId)?.name || "").toLowerCase().includes(t));
    }
    if (category !== "all") list = list.filter((c) => c.categoryId === category);
    if (level !== "all") list = list.filter((c) => (c.level || "").toLowerCase().includes(level.toLowerCase()));
    if (price === "free") list = list.filter((c) => c.price === 0);
    if (price === "paid") list = list.filter((c) => c.price > 0);
    if (minRating) list = list.filter((c) => c.rating >= minRating);

    switch (sort) {
      case "rating":   list.sort((a, b) => b.rating - a.rating); break;
      case "newest":   list.sort((a, b) => b.id.localeCompare(a.id)); break;
      case "priceLow": list.sort((a, b) => a.price - b.price); break;
      case "priceHigh":list.sort((a, b) => b.price - a.price); break;
      default:         list.sort((a, b) => b.students - a.students); // popular
    }
    return list;
  }

  /* ---------- cart ---------- */
  const cart = () => (state.carts[bucket()] || []).slice();
  const inCart = (id) => cart().includes(id);
  function addToCart(id) {
    const b = bucket();
    if (isEnrolled(id)) return { ok: false, error: "You're already enrolled in this course." };
    state.carts[b] = unique([...(state.carts[b] || []), id]);
    save(); return { ok: true };
  }
  function removeFromCart(id) {
    const b = bucket();
    state.carts[b] = (state.carts[b] || []).filter((x) => x !== id);
    save();
  }
  function clearCart() { state.carts[bucket()] = []; save(); }
  function cartCourses() { return cart().map(getCourse).filter(Boolean); }
  function cartTotal() { return cartCourses().reduce((s, c) => s + c.price, 0); }
  function cartOldTotal() { return cartCourses().reduce((s, c) => s + (c.oldPrice || c.price), 0); }

  /* ---------- wishlist ---------- */
  const wishlist = () => (state.wishlists[bucket()] || []).slice();
  const inWishlist = (id) => wishlist().includes(id);
  function toggleWishlist(id) {
    const b = bucket();
    const list = state.wishlists[b] || [];
    state.wishlists[b] = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    save(); return state.wishlists[b].includes(id);
  }
  function wishlistCourses() { return wishlist().map(getCourse).filter(Boolean); }

  /* ---------- enrollment ---------- */
  function enrollmentsForUser(userId) { return state.enrollments.filter((e) => e.userId === userId); }
  function isEnrolled(courseId) {
    const u = currentUser(); if (!u) return false;
    return state.enrollments.some((e) => e.userId === u.id && e.courseId === courseId);
  }
  function enrollOne(courseId) {
    const u = currentUser(); if (!u) return { ok: false, error: "Please sign in first." };
    if (isEnrolled(courseId)) return { ok: true };
    const c = getCourse(courseId);
    state.enrollments.push({
      id: "e" + Date.now() + Math.floor(Math.random() * 1000),
      userId: u.id, courseId, date: new Date().toISOString().slice(0, 10),
      price: c ? c.price : 0,
    });
    save(); return { ok: true };
  }
  function checkout() {
    const u = currentUser(); if (!u) return { ok: false, error: "Please sign in to complete checkout." };
    const items = cart();
    if (!items.length) return { ok: false, error: "Your cart is empty." };
    const subtotal = +cartTotal().toFixed(2);
    const discount = +couponDiscount(subtotal).toFixed(2);
    const total = +(subtotal - discount).toFixed(2);
    const coupon = getCoupon();
    items.forEach((id) => enrollOne(id));
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    state.orders.push({
      id: orderId, userId: u.id, date: new Date().toISOString().slice(0, 10),
      items: items.slice(), subtotal, discount, total, coupon: coupon ? coupon.code : null,
    });
    clearCart(); clearCoupon();
    return { ok: true, count: items.length, total, orderId };
  }
  function myCourses() {
    const u = currentUser(); if (!u) return [];
    return enrollmentsForUser(u.id).map((e) => getCourse(e.courseId)).filter(Boolean);
  }

  /* ---------- progress ---------- */
  function lectureKeys(course) {
    const keys = [];
    (course.curriculum || []).forEach((s, si) => s.lectures.forEach((l, li) => keys.push(si + "-" + li)));
    return keys;
  }
  function completed(courseId) {
    const u = currentUser(); if (!u) return [];
    return ((state.progress[u.id] || {})[courseId] || []).slice();
  }
  function toggleLecture(courseId, key) {
    const u = currentUser(); if (!u) return [];
    state.progress[u.id] = state.progress[u.id] || {};
    const list = state.progress[u.id][courseId] || [];
    state.progress[u.id][courseId] = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
    save(); return state.progress[u.id][courseId];
  }
  function progressPct(courseId) {
    const c = getCourse(courseId); if (!c) return 0;
    const total = lectureKeys(c).length || 1;
    return Math.round((completed(courseId).length / total) * 100);
  }
  function isCompleted(courseId) { return progressPct(courseId) === 100; }
  function certificateData(courseId) {
    const u = currentUser(); const c = getCourse(courseId); if (!u || !c) return null;
    const e = enrollmentsForUser(u.id).find((x) => x.courseId === courseId);
    return { user: u, course: c, date: e ? e.date : new Date().toISOString().slice(0, 10), id: "SL-" + c.id.toUpperCase() + "-" + u.id.toUpperCase() };
  }

  /* ---------- coupons ---------- */
  function getCoupon() { return state.coupon[bucket()] || null; }
  function applyCoupon(code) {
    code = (code || "").trim().toUpperCase();
    if (!code) return { ok: false, error: "Enter a coupon code." };
    const c = (App.seed.coupons || []).find((x) => x.code === code);
    if (!c) return { ok: false, error: "That coupon code isn't valid." };
    state.coupon[bucket()] = c; save();
    return { ok: true, coupon: c };
  }
  function clearCoupon() { delete state.coupon[bucket()]; save(); }
  function couponDiscount(subtotal) {
    const c = getCoupon(); if (!c) return 0;
    const d = c.type === "percent" ? subtotal * (c.value / 100) : c.value;
    return Math.min(d, subtotal);
  }
  function cartPayable() { const s = cartTotal(); return Math.max(0, +(s - couponDiscount(s)).toFixed(2)); }

  /* ---------- reviews ---------- */
  function ratingBreakdown(course) {
    const r = course.rating || 4.5;
    const raw = [5, 4, 3, 2, 1].map((s) => Math.max(0.02, Math.exp(-Math.pow(s - r, 2) * 1.4)));
    const sum = raw.reduce((a, b) => a + b, 0);
    return [5, 4, 3, 2, 1].map((s, i) => ({ star: s, pct: Math.round((raw[i] / sum) * 100) }));
  }
  function hasReviewed(courseId) {
    const u = currentUser(); const c = getCourse(courseId); if (!u || !c) return false;
    return (c.reviews || []).some((r) => r.self && r.user === u.name);
  }
  function addReview(courseId, { rating, text }) {
    const u = currentUser(); if (!u) return { ok: false, error: "Please sign in to review." };
    const c = getCourse(courseId); if (!c) return { ok: false, error: "Course not found." };
    rating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
    c.reviews = c.reviews || [];
    c.reviews.unshift({ user: u.name, rating, date: "Just now", text: (text || "").trim(), self: true });
    const newAvg = ((c.rating * c.ratingsCount) + rating) / (c.ratingsCount + 1);
    c.ratingsCount += 1; c.rating = Math.round(newAvg * 10) / 10;
    save(); return { ok: true };
  }

  /* ---------- notes ---------- */
  function notesFor(courseId) {
    const u = currentUser(); if (!u) return [];
    return ((state.notes[u.id] || {})[courseId] || []).slice();
  }
  function addNote(courseId, { lectureKey, text }) {
    const u = currentUser(); if (!u || !(text || "").trim()) return;
    state.notes[u.id] = state.notes[u.id] || {};
    const list = state.notes[u.id][courseId] || [];
    list.unshift({ id: "n" + Date.now(), lectureKey: lectureKey || "", text: text.trim(), date: new Date().toISOString().slice(0, 10) });
    state.notes[u.id][courseId] = list; save();
  }
  function deleteNote(courseId, noteId) {
    const u = currentUser(); if (!u) return;
    const list = (state.notes[u.id] || {})[courseId] || [];
    state.notes[u.id][courseId] = list.filter((n) => n.id !== noteId); save();
  }

  /* ---------- orders / profile / lookups ---------- */
  function ordersForUser(userId) { return state.orders.filter((o) => o.userId === userId).sort((a, b) => (b.date || "").localeCompare(a.date || "")); }
  function myOrders() { const u = currentUser(); return u ? ordersForUser(u.id) : []; }
  function updateProfile({ name, email, password }) {
    const u = currentUser(); if (!u) return { ok: false, error: "Not signed in." };
    email = (email || "").trim().toLowerCase();
    if (!name || !email) return { ok: false, error: "Name and email are required." };
    if (state.users.some((x) => x.id !== u.id && x.email.toLowerCase() === email)) return { ok: false, error: "That email is already in use." };
    if (password && password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    u.name = name.trim(); u.email = email; u.avatarSeed = name.trim();
    if (password) u.password = password;
    save(); return { ok: true };
  }
  function coursesByInstructor(id) { return state.courses.filter((c) => c.instructorId === id); }
  function relatedCourses(course, n = 4) {
    const same = state.courses.filter((c) => c.id !== course.id && c.categoryId === course.categoryId);
    const others = state.courses.filter((c) => c.id !== course.id && c.categoryId !== course.categoryId).sort((a, b) => b.students - a.students);
    return [...same, ...others].slice(0, n);
  }

  /* ---------- admin CRUD ---------- */
  function saveCourse(data) {
    const idx = state.courses.findIndex((c) => c.id === data.id);
    if (idx >= 0) {
      state.courses[idx] = { ...state.courses[idx], ...data };
    } else {
      const id = "c" + Date.now();
      state.courses.push({
        id,
        slug: (data.slug || data.title || id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        rating: data.rating || 4.5, ratingsCount: data.ratingsCount || 0, students: data.students || 0,
        hours: data.hours || 10, lectures: data.lectures || 0, articles: 0, resources: 0,
        level: data.level || "All Levels", language: "English", updated: "New",
        whatYouLearn: data.whatYouLearn || [], requirements: data.requirements || [],
        curriculum: data.curriculum || [], reviews: [],
        ...data,
      });
    }
    save();
  }
  function deleteCourse(id) {
    state.courses = state.courses.filter((c) => c.id !== id);
    state.enrollments = state.enrollments.filter((e) => e.courseId !== id);
    save();
  }
  function saveCategory(data) {
    const idx = state.categories.findIndex((c) => c.id === data.id);
    if (idx >= 0) state.categories[idx] = { ...state.categories[idx], ...data };
    else state.categories.push({ id: "cat" + Date.now(), icon: "tag", color: "#0178CF", ...data });
    save();
  }
  function deleteCategory(id) { state.categories = state.categories.filter((c) => c.id !== id); save(); }
  function deleteUser(id) {
    state.users = state.users.filter((u) => u.id !== id);
    state.enrollments = state.enrollments.filter((e) => e.userId !== id);
    state.orders = state.orders.filter((o) => o.userId !== id);
    if (state.notes[id]) delete state.notes[id];
    save();
  }

  /* ---------- analytics ---------- */
  function analytics() {
    const revenue = state.enrollments.reduce((s, e) => s + (e.price || 0), 0);
    const byCategory = {};
    state.categories.forEach((cat) => (byCategory[cat.id] = { name: cat.name, color: cat.color, count: 0, revenue: 0 }));
    state.enrollments.forEach((e) => {
      const c = getCourse(e.courseId); if (!c) return;
      const b = byCategory[c.categoryId]; if (!b) return;
      b.count += 1; b.revenue += e.price || 0;
    });
    const topCourses = state.courses.map((c) => {
      const ens = state.enrollments.filter((e) => e.courseId === c.id);
      return { course: c, count: ens.length, revenue: ens.reduce((s, e) => s + (e.price || 0), 0) };
    }).sort((a, b) => b.count - a.count);
    // enrollments per month
    const months = {};
    state.enrollments.forEach((e) => {
      const m = (e.date || "").slice(0, 7);
      months[m] = (months[m] || 0) + 1;
    });
    return {
      revenue,
      enrollments: state.enrollments.length,
      students: state.users.length,
      courses: state.courses.length,
      byCategory: Object.values(byCategory),
      topCourses,
      months,
    };
  }

  function enrichedEnrollments() {
    return state.enrollments
      .slice()
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .map((e) => ({
        ...e,
        user: state.users.find((u) => u.id === e.userId),
        course: getCourse(e.courseId),
      }));
  }

  function resetDemo() { localStorage.removeItem(KEY); init(); }

  return {
    init, subscribe, getState: () => state,
    // auth
    currentUser, isAdmin, isLoggedIn, register, login, logout, adminLogin, adminLogout,
    // lookups
    getCourse, getCategory, getInstructor, allCourses, allCategories, queryCourses, lectureKeys,
    // cart
    cart, inCart, addToCart, removeFromCart, clearCart, cartCourses, cartTotal, cartOldTotal,
    // wishlist
    wishlist, inWishlist, toggleWishlist, wishlistCourses,
    // enroll / progress
    isEnrolled, enrollOne, checkout, myCourses, enrollmentsForUser,
    completed, toggleLecture, progressPct, isCompleted, certificateData,
    // coupons
    getCoupon, applyCoupon, clearCoupon, couponDiscount, cartPayable,
    // reviews / notes
    ratingBreakdown, hasReviewed, addReview, notesFor, addNote, deleteNote,
    // orders / profile / lookups
    ordersForUser, myOrders, updateProfile, coursesByInstructor, relatedCourses,
    // admin
    saveCourse, deleteCourse, saveCategory, deleteCategory, deleteUser, analytics, enrichedEnrollments, allUsers: () => state.users.slice(),
    resetDemo,
  };
})();
