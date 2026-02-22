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
}, { threshold: 0.15 });

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

form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    let valid = true;

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');

    // Clear previous errors before re-validating
    clearError(nameField);
    clearError(emailField);
    clearError(messageField);

    if (!nameField.value.trim()) {
        setError(nameField, 'Please enter your name.');
        valid = false;
    }

    if (!emailField.value.trim() || !validateEmail(emailField.value.trim())) {
        setError(emailField, 'Please enter a valid email.');
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

        const formData = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            message: messageField.value.trim(),
        };

        try {
            // NOTE: Replace 'https://api.example.com/contact' with your actual API endpoint.
            const response = await fetch('https://api.example.com/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                status.textContent = 'Thank you! Your message has been sent.';
                form.reset();
            } else {
                status.textContent = 'Sorry, there was an error sending your message. Please try again later.';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            status.textContent = 'A network error occurred. Please check your connection and try again.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    } else {
        status.textContent = 'Please fix the highlighted fields.';
    }
});

// Set initial header state on load
handleScroll();

// Dynamically set the copyright year
const yearSpan = document.getElementById('copyright-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Add 3D Tilt Effect to Cards
const tiltCards = document.querySelectorAll('.service-card, .industry-card, .testimonial-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    });
});
