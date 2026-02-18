const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const sections = document.querySelectorAll('main section');
const form = document.querySelector('.contact__form');

const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
};

menuToggle.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

const handleScroll = () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleScroll);

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('[data-animate]').forEach(element => {
    revealObserver.observe(element);
});

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
    if (section.id) {
        sectionObserver.observe(section);
    }
});

const setError = (field, message) => {
    const error = field.parentElement.querySelector('.error-message');
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
};

const clearError = field => {
    const error = field.parentElement.querySelector('.error-message');
    field.removeAttribute('aria-invalid');
    error.textContent = '';
};

const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    let valid = true;

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');

    if (!nameField.value.trim()) {
        setError(nameField, 'Please enter your name.');
        valid = false;
    } else {
        clearError(nameField);
    }

    if (!emailField.value.trim() || !validateEmail(emailField.value.trim())) {
        setError(emailField, 'Please enter a valid email.');
        valid = false;
    } else {
        clearError(emailField);
    }

    if (!messageField.value.trim()) {
        setError(messageField, 'Please share a short message.');
        valid = false;
    } else {
        clearError(messageField);
    }

    if (valid) {
        status.textContent = 'Thank you! Your message has been sent.';
        form.reset();
    } else {
        status.textContent = 'Please fix the highlighted fields.';
    }
});

handleScroll();
