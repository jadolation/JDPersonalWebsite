// Romantic page behaviors (no content swapping; stable page)

// Set romantic favicon dynamically
(function setRomanticFavicon() {
    function updateLink(rel, href, sizes) {
        let el = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`);
        if (!el) {
            el = document.createElement('link');
            el.rel = rel;
            if (sizes) el.setAttribute('sizes', sizes);
            document.head.appendChild(el);
        }
        // Cache-bust so browsers pick up changes
        el.href = href + '?v=' + Date.now();
    }

    updateLink('icon', 'assets/pictures/favicon_io-kr/favicon.ico');
    updateLink('icon', 'assets/pictures/favicon_io-kr/favicon-16x16.png', '16x16');
    updateLink('icon', 'assets/pictures/favicon_io-kr/favicon-32x32.png', '32x32');
    updateLink('apple-touch-icon', 'assets/pictures/favicon_io-kr/apple-touch-icon.png');
})();

// AOS init (guarded)
if (window.AOS && typeof window.AOS.init === 'function') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// Navigation
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        // Only smooth-scroll same-page anchors
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// Simple contact form handler (same as main page)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Particles (lightweight)
function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    const particleCount = 36;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = (Math.random() * 5) + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.background = `rgba(255, 107, 157, ${Math.random() * 0.5 + 0.2})`;
        particlesContainer.appendChild(particle);
    }
}

if (window.innerWidth >= 768) {
    window.addEventListener('load', createParticles);
}

// Floating theme/heart button becomes a page switcher (heart -> back to portfolio)
const themeToggleBtn = document.createElement('button');
themeToggleBtn.className = 'theme-toggle-btn';
themeToggleBtn.setAttribute('aria-label', 'Back to portfolio');
themeToggleBtn.innerHTML = '<i class="fas fa-moon theme-icon"></i>';
document.body.appendChild(themeToggleBtn);

// Make it visible immediately so it's present in the hero section
themeToggleBtn.classList.add('visible');

// Keep legacy scroll behavior too (keeps class in sync if other code toggles it)
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        themeToggleBtn.classList.add('visible');
    } else {
        themeToggleBtn.classList.add('visible');
    }
});

themeToggleBtn.addEventListener('click', () => {
    localStorage.setItem('portfolio-theme', 'techy');
    window.location.href = 'index.html';
});

// Ensure hero logo animations start when the logo becomes visible (similar to main page)
(function enableHeroLogoAnimations() {
    const heroLogo = document.querySelector('.hero-logo');
    if (!heroLogo) return;
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroLogo.classList.remove('not-visible');
                    observer.unobserve(heroLogo);
                }
            });
        }, { threshold: 0.05 });
        io.observe(heroLogo);
    } else {
        heroLogo.classList.remove('not-visible');
    }
})();

// Valentine interaction
const yesBtn = document.getElementById('valentineYes');
const maybeBtn = document.getElementById('valentineMaybe');
const buttonsWrap = document.getElementById('valentineButtons');
const responseWrap = document.getElementById('valentineResponse');
const responseText = document.getElementById('valentineResponseText');

function showValentineResponse(text) {
    if (buttonsWrap) buttonsWrap.style.display = 'none';
    if (responseText) responseText.textContent = text;
    if (responseWrap) responseWrap.style.display = 'block';
    createHearts(22);
}

if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        showValentineResponse('You just made me the happiest person in the world! 💖✨🎉');
    });
}

if (maybeBtn) {
    maybeBtn.addEventListener('click', () => {
        showValentineResponse('I\'ll wait for you, because you\'re worth it 💕 (but I have a feeling you\'ll say yes soon 😊)');
    });
}

function createHearts(count = 18) {
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['💕', '💖', '💘', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heart.style.fontSize = (Math.random() * 20 + 18) + 'px';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 5000);
    }
}
