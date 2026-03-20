/* ═══════════════════════════════════════════
   LUCIDE ICONS INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/* ═══════════════════════════════════════════
   ELEMENT REFS
═══════════════════════════════════════════ */
const header     = document.querySelector('.site-header');
const navLinks   = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu    = document.querySelector('.nav-links');
const sections   = document.querySelectorAll('main section');
const form       = document.querySelector('.contact__form');

/* ═══════════════════════════════════════════
   MOBILE MENU TOGGLE
═══════════════════════════════════════════ */
const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
};

menuToggle.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

/* ═══════════════════════════════════════════
   HEADER SCROLL STATE
═══════════════════════════════════════════ */
const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ═══════════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK (Intersection Observer)
═══════════════════════════════════════════ */
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
});

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const answerId   = button.getAttribute('aria-controls');
        const answer     = document.getElementById(answerId);

        // Close all other items
        document.querySelectorAll('.faq__question').forEach(btn => {
            if (btn !== button) {
                btn.setAttribute('aria-expanded', 'false');
                const otherAnswer = document.getElementById(btn.getAttribute('aria-controls'));
                if (otherAnswer) otherAnswer.classList.remove('open');
            }
        });

        // Toggle current
        button.setAttribute('aria-expanded', (!isExpanded).toString());
        if (answer) answer.classList.toggle('open', !isExpanded);
    });
});

/* ═══════════════════════════════════════════
   CONTACT FORM VALIDATION
═══════════════════════════════════════════ */
const setError = (field, message) => {
    const error = field.parentElement.querySelector('.error-message');
    field.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
};

const clearError = field => {
    const error = field.parentElement.querySelector('.error-message');
    field.removeAttribute('aria-invalid');
    if (error) error.textContent = '';
};

const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

if (form) {
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const status       = form.querySelector('.form-status');
        const submitButton = form.querySelector('button[type="submit"]');
        const nameField    = form.querySelector('#name');
        const emailField   = form.querySelector('#email');
        const messageField = form.querySelector('#message');
        let valid = true;

        clearError(nameField);
        clearError(emailField);
        clearError(messageField);

        if (!nameField.value.trim()) {
            setError(nameField, 'Please enter your name.');
            valid = false;
        }

        if (!emailField.value.trim() || !validateEmail(emailField.value.trim())) {
            setError(emailField, 'Please enter a valid email address.');
            valid = false;
        }

        if (!messageField.value.trim()) {
            setError(messageField, 'Please share a short message.');
            valid = false;
        }

        if (valid) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            status.textContent = '';

            try {
                const response = await fetch('https://formspree.io/f/xdawjoqo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        name:    nameField.value.trim(),
                        email:   emailField.value.trim(),
                        message: messageField.value.trim(),
                    }),
                });

                if (response.ok) {
                    status.textContent = '✓ Message sent! We\'ll get back to you soon.';
                    status.style.color = '#16a34a';
                    form.reset();
                } else {
                    const data = await response.json();
                    status.textContent = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
                    status.style.color = '#dc2626';
                }
            } catch (error) {
                status.textContent = 'Network error. Please check your connection and try again.';
                status.style.color = '#dc2626';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        } else {
            if (status) status.textContent = 'Please fix the highlighted fields.';
        }
    });
}

/* ═══════════════════════════════════════════
   MODAL SYSTEM
═══════════════════════════════════════════ */
const modalVideo   = document.getElementById('modal-video');
const modalContact = document.getElementById('modal-contact');

function openModal(modal) {
    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    const panel = modal.querySelector('.modal__panel');
    requestAnimationFrame(() => panel && panel.focus());
}

function closeModal(modal) {
    modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    // Pause any video inside the modal
    const vid = modal.querySelector('video');
    if (vid) { vid.pause(); vid.currentTime = 0; }
}

// Close via backdrop click or any [data-modal-close] button
document.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', () => {
        const modal = el.closest('.modal');
        if (modal) closeModal(modal);
    });
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        [modalVideo, modalContact].forEach(m => {
            if (m && !m.hasAttribute('hidden')) closeModal(m);
        });
    }
});

// ── Trigger: Demo Reel play button → play video inline in section ──
const demoPlayBtn  = document.querySelector('.demo-reel__play');
const demoVideo    = document.getElementById('demo-video');
const demoOverlay  = document.getElementById('demo-overlay');

if (demoPlayBtn && demoVideo) {
    demoPlayBtn.addEventListener('click', () => {
        demoOverlay.classList.add('hidden');
        demoVideo.setAttribute('controls', '');
        demoVideo.play().catch(() => {});
    });

    // Show overlay again when video ends
    demoVideo.addEventListener('ended', () => {
        demoVideo.removeAttribute('controls');
        demoVideo.currentTime = 0;
        demoOverlay.classList.remove('hidden');
    });
}

// Hero "View Demo Reel" button → open video modal (full-screen experience)
const heroDemoBtn = document.querySelector('.hero__actions .btn-primary');
if (heroDemoBtn && heroDemoBtn.getAttribute('href') === '#work') {
    heroDemoBtn.addEventListener('click', e => {
        e.preventDefault();
        openModal(modalVideo);
    });
}

// ── Trigger: Nav "Contact Us" CTA pill ──
const navContactBtn = document.querySelector('.nav-link--cta');
if (navContactBtn) {
    navContactBtn.addEventListener('click', e => {
        e.preventDefault();
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        openModal(modalContact);
    });
}

// ── Modal contact form validation ──
const modalForm = document.getElementById('modal-contact-form');
if (modalForm) {
    modalForm.addEventListener('submit', async e => {
        e.preventDefault();
        const status       = modalForm.querySelector('.form-status');
        const submitBtn    = modalForm.querySelector('.modal__submit');
        const nameField    = modalForm.querySelector('#modal-name');
        const emailField   = modalForm.querySelector('#modal-email');
        const messageField = modalForm.querySelector('#modal-message');
        let valid = true;

        [nameField, emailField, messageField].forEach(f => clearError(f));

        if (!nameField.value.trim()) {
            setError(nameField, 'Please enter your name.');
            valid = false;
        }
        if (!emailField.value.trim() || !validateEmail(emailField.value.trim())) {
            setError(emailField, 'Please enter a valid email address.');
            valid = false;
        }
        if (!messageField.value.trim()) {
            setError(messageField, 'Please share a short message.');
            valid = false;
        }

        if (valid) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            status.textContent = '';

            try {
                const response = await fetch('https://formspree.io/f/xdawjoqo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        name:    nameField.value.trim(),
                        email:   emailField.value.trim(),
                        message: messageField.value.trim(),
                    }),
                });
                if (response.ok) {
                    status.textContent = '✓ Message sent! We\'ll be in touch shortly.';
                    status.style.color = '#16a34a';
                    modalForm.reset();
                } else {
                    status.textContent = 'Something went wrong. Please try again.';
                    status.style.color = '#dc2626';
                }
            } catch {
                status.textContent = 'Network error. Please check your connection.';
                status.style.color = '#dc2626';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        } else {
            if (status) status.textContent = 'Please fix the highlighted fields.';
        }
    });
}

/* ═══════════════════════════════════════════
   COPYRIGHT YEAR
═══════════════════════════════════════════ */
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   3D TILT EFFECT — Cards
═══════════════════════════════════════════ */
const tiltCards = document.querySelectorAll('.service-card, .industry-card, .case-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const cx      = rect.width  / 2;
        const cy      = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -7;
        const rotateY = ((x - cx) / cx) *  7;

        card.style.transform  = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    });
});
