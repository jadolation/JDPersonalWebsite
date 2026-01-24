// AOS init
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navigation
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Typing effect
const typingText = document.querySelector('.typing-text');
const phrases = [
    'IT Student',
    'Web Developer',
    'Problem Solver',
    'Tech Enthusiast',
    'Quick Learner'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a backend
    // For now, we'll just show an alert
    alert('Thank you for your message! I\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Particles
function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create particles on load (skip on small screens to improve performance)
if (window.innerWidth >= 768) {
    window.addEventListener('load', createParticles);
}

// Scroll-to-top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #00d4ff, #0099ff);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0)';
});

// Project cards
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Console messages
console.log('%c👋 Hello, Developer!', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
console.log('%cWelcome to my portfolio. Looking for something? 🔍', 'font-size: 14px; color: #a0a8b8;');
console.log('%cFeel free to reach out: zaratejandale15@gmail.com', 'font-size: 12px; color: #00ff88;');
 
// Logo interactivity
(function() {
    const logoBtn = document.querySelector('.hero-logo-button');
    const logoModal = document.getElementById('logoModal');
    const modalClose = document.querySelector('.logo-modal-close');
    const modalBackdrop = document.querySelector('.logo-modal-backdrop');

    if (!logoBtn || !logoModal) return;
    const logoImg = logoBtn.querySelector('.hero-logo');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let wasDragged = false;

    function openLogoModal() {
        logoModal.classList.add('open');
        logoModal.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
    }

    function closeLogoModal() {
        logoModal.classList.remove('open');
        logoModal.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        logoBtn.focus();
    }

    // Trigger a quick spark effect when clicked
    function triggerSpark() {
        if (!logoImg) return;
        logoImg.classList.remove('logo-spark');
        // trigger reflow to restart animation
        void logoImg.offsetWidth;
        logoImg.classList.add('logo-spark');
        // remove after animation completes
        const cleanup = () => {
            logoImg.classList.remove('logo-spark');
            logoImg.removeEventListener('animationend', cleanup);
        };
        logoImg.addEventListener('animationend', cleanup);
    }

    // Click handler: ignore if it was a drag
    logoBtn.addEventListener('click', (e) => {
        if (wasDragged) {
            wasDragged = false;
            return;
        }
        // unique action: spark + open modal
        triggerSpark();
        openLogoModal();
    });

    logoBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerSpark();
            openLogoModal();
        }
    });

    if (modalClose) modalClose.addEventListener('click', closeLogoModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeLogoModal);

    // close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && logoModal.classList.contains('open')) {
            closeLogoModal();
        }
    });

    // ---- Drag behavior: move the button while dragging, then snap back ----
    function onPointerDown(e) {
        // only primary button
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDragging = false;
        wasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        lastX = 0;
        lastY = 0;
        logoBtn.setPointerCapture(e.pointerId);
        logoBtn.classList.remove('dragging');
        // pause image animation while interacting
        if (logoImg) logoImg.style.animationPlayState = 'paused';
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const moveDist = Math.hypot(dx, dy);
        if (!isDragging && moveDist > 6) {
            isDragging = true;
            logoBtn.classList.add('dragging');
        }
        if (isDragging) {
            lastX = dx;
            lastY = dy;
            // move the button
            logoBtn.style.transition = 'none';
            logoBtn.style.transform = `translate(${dx}px, ${dy}px)`;
        }
    }

    function onPointerUp(e) {
        try { logoBtn.releasePointerCapture(e.pointerId); } catch(_) {}
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        if (isDragging) {
            wasDragged = true;
            // snap back with transition
            logoBtn.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1)';
            logoBtn.style.transform = '';
            // after transition, cleanup
            const cleanup = () => {
                logoBtn.style.transition = '';
                logoBtn.classList.remove('dragging');
                if (logoImg) logoImg.style.animationPlayState = '';
                logoBtn.removeEventListener('transitionend', cleanup);
            };
            logoBtn.addEventListener('transitionend', cleanup);
        } else {
            // not dragged, just restore animation
            if (logoImg) logoImg.style.animationPlayState = '';
        }
        isDragging = false;
    }

    logoBtn.addEventListener('pointerdown', onPointerDown);
})();

    // About carousel
    (function() {
        const images = [
            'assets/pictures/jd2.jpg',
            'assets/pictures/jd3.jpg',
            'assets/pictures/jd4.jpg',
            'assets/pictures/jd5.jpg',
            'assets/pictures/jd6.jpg',
            'assets/pictures/jd7.jpg',
            'assets/pictures/jd8.jpg',
            'assets/pictures/profilePic.jpg'
        ];

        const colors = [
            '#ffd700',
            '#00d4ff',
            '#00ff88',
            '#ff6b6b',
            '#b19cff',
            '#ff9f1c',
            '#7bd389',
            '#c97bd3'
        ];

        const main = document.getElementById('carouselMain');
        const border = document.getElementById('aboutImageBorder');
        const thumbsContainer = document.getElementById('carouselThumbs');
        if (!main || !border || !thumbsContainer) return;

        const thumbs = Array.from(thumbsContainer.querySelectorAll('.thumb'));
        let current = 0;
        let autoInterval = null;

        function hexToRgba(hex, a) {
            let c = hex.replace('#', '');
            if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
            const bigint = parseInt(c, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r},${g},${b},${a})`;
        }

        function setActive(i) {
            current = ((i % images.length) + images.length) % images.length;
            main.src = images[current];

            // trigger a quick bounce visual when image changes
            main.classList.remove('bounce');
            // force reflow to restart animation
            void main.offsetWidth;
            main.classList.add('bounce');
            main.addEventListener('animationend', () => { main.classList.remove('bounce'); }, { once: true });

            thumbs.forEach((t, idx) => {
                if (idx === current) t.classList.add('active'); else t.classList.remove('active');
            });
            const color = colors[current % colors.length];
            border.style.borderColor = color;
            border.style.boxShadow = `0 12px 40px ${hexToRgba(color, 0.12)}`;
        }

        function startAuto() {
            if (autoInterval) return;
            autoInterval = setInterval(() => setActive(current + 1), 4000);
        }
        function pauseAuto() { if (autoInterval) { clearInterval(autoInterval); autoInterval = null; } }
        function resumeAuto() { if (!autoInterval) startAuto(); }
        function resetAuto() { pauseAuto(); setTimeout(startAuto, 2600); }

        thumbs.forEach((btn, idx) => {
            btn.addEventListener('click', () => { setActive(idx); resetAuto(); });
            btn.addEventListener('mouseenter', pauseAuto);
            btn.addEventListener('mouseleave', resumeAuto);
        });

        main.addEventListener('click', () => { setActive(current + 1); resetAuto(); });
        main.addEventListener('mouseenter', pauseAuto);
        main.addEventListener('mouseleave', resumeAuto);

        // initialize
        setActive(0);
        startAuto();
    })();

    // Defer hero logo animations until the logo is visible 
    (function() {
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
            // Fallback: enable animations immediately
            heroLogo.classList.remove('not-visible');
        }
    })();

    async function loadProjects() {
        const response = await fetch('./projects.json');
        const projects = await response.json();
        const grid = document.querySelector('.projects-grid');

        if (!grid) {
            // Fallback: replace #projects section if grid isn't present
            const container = document.getElementById('projects');
            if (!container) return;
            container.innerHTML = projects.map(repo => `
                <div class="project-card" data-aos="fade-up">
                    <div class="project-content">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description provided.'}</p>
                        <div class="project-tags">
                            ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                        </div>
                        <a href="${repo.url}" target="_blank">View on GitHub</a>
                    </div>
                </div>
            `).join('');
            return;
        }

        grid.innerHTML = projects.map((repo, idx) => `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${100 + (idx * 100)}">
                <div class="project-image">
                    <img src="${repo.image || 'https://via.placeholder.com/600x400'}" alt="${repo.name}" data-repo="${repo.name}">
                    <div class="project-overlay">
                        <div class="project-links">
                            <a href="${repo.url}" target="_blank" class="project-link" aria-label="View ${repo.name} on GitHub"><i class="fab fa-github"></i></a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" aria-label="Open ${repo.name} demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description provided.'}</p>
                    <div class="project-tags">
                        ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // After rendering, try to replace placeholders with images from each repo (if available)
        const owner = 'jadolation';
        const candidates = [
            'assets/pictures/preview.png',
            'assets/pictures/preview.jpg',
            'assets/preview.png',
            'assets/preview.jpg',
            'assets/screenshot.png',
            'assets/screenshot.jpg',
            'screenshot.png',
            'screenshot.jpg',
            'thumbnail.png',
            'thumbnail.jpg',
            'images/preview.png',
            'images/preview.jpg',
            'docs/screenshot.png',
            'docs/preview.png',
            'logo.png'
        ];

        function timeoutFetch(url, ms = 3000) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), ms);
            return fetch(url, { signal: controller.signal, cache: 'no-cache' })
                .finally(() => clearTimeout(id));
        }

        async function findRepoImage(repoName) {
            for (const path of candidates) {
                const url = `https://raw.githubusercontent.com/${owner}/${repoName}/main/${path}`;
                try {
                    const res = await timeoutFetch(url, 3000);
                    if (!res.ok) continue;
                    const ct = res.headers.get('content-type') || '';
                    if (ct.startsWith('image/')) return url;
                    // some hosts may not set content-type; try to treat small responses as images
                    const blob = await res.blob();
                    if (blob && blob.type && blob.type.startsWith('image/')) return url;
                } catch (err) {
                    // ignore and try next
                }
            }
            return null;
        }

        // Update image elements asynchronously
        projects.forEach(async (repo) => {
            const imgEl = document.querySelector(`img[data-repo="${CSS.escape(repo.name)}"]`);
            if (!imgEl) return;
            // if repo provided an `image` field, use it
            if (repo.image) {
                imgEl.src = repo.image;
                return;
            }
            const found = await findRepoImage(repo.name);
            if (found) imgEl.src = found;
            // otherwise keep placeholder; you can assign later via repo.json or manual edits
        });
}

loadProjects();
