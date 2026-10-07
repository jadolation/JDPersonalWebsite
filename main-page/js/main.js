// Load romantic content
// Content is loaded from romantic-content.js via script tag
// Access via window.romanticContent and window.techContent

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

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (this.classList.contains('nav-link')) {
            this.classList.add('active');
        }
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email || !data.message) {
            if (formStatus) {
                formStatus.textContent = 'Please fill in all required fields.';
                formStatus.className = 'form-status error';
            }
            return;
        }
        
        // No backend configured - show info in form
        if (formStatus) {
            formStatus.textContent = 'Form is ready but has no backend configured. In production, this would send your message to zaratejandale15@gmail.com.';
            formStatus.className = 'form-status success';
        }
        
        contactForm.reset();
        
        // Clear message after a few seconds
        setTimeout(() => {
            if (formStatus) {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }
        }, 8000);
    });
}

// Console messages
console.log('%c Hello, Developer!', 'font-size: 20px; color: #8DB4FF; font-weight: bold;');
console.log('%cWelcome to my portfolio. Looking for something?', 'font-size: 14px; color: #9BA4B8;');
console.log('%cFeel free to reach out: zaratejandale15@gmail.com', 'font-size: 12px; color: #F0CE86;');

// SVG external-link arrow (reused in every card overlay)
const EXTERNAL_LINK_SVG = '<svg class="project-overlay-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

const IMG_FALLBACK_HTML = (name) =>
    `<div class="project-img-fallback" aria-hidden="true">${name}</div>`;

// Project rows
async function loadProjects() {
    const response = await fetch('./projects.json');
    const projects = await response.json();
    const list = document.getElementById('projectsList');

    const escapeHtml = (value) => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    if (!list) return;

    list.innerHTML = projects.map((repo, index) => {
        const repoName = escapeHtml(repo.name);
        const repoUrl = escapeHtml(repo.url);
        const repoDesc = repo.description
            ? escapeHtml(repo.description)
            : null;
        const repoLang = repo.language
            ? escapeHtml(repo.language)
            : '';
        const isPersonalWebsite = repo.name === 'JDPersonalWebsite';
        const siteLabel = isPersonalWebsite
            ? '<span class="project-site-label">This site</span>'
            : '';

        const descLine = repoDesc
            ? `<p class="project-desc">${repoDesc}</p>`
            : '';
        const langLine = repoLang
            ? `<span class="project-lang">${repoLang}</span>`
            : '';

        const imgSrc =
            `https://opengraph.githubassets.com/1/${encodeURIComponent(repo.name)}`;
        const imgW = 640;
        const imgH = 320;
        const isAboveFold = index < 3;
        const lazyAttr = isAboveFold ? '' : ' loading="lazy"';
        const altText = `${repoName} repository preview`;
        const imgErrorHandler = `this.style.display='none';this.nextElementSibling.style.display='flex';`;

        return `
        <article class="project-card${isPersonalWebsite ? ' project-card--this-site' : ''}">
            <a href="${repoUrl}" target="_blank" rel="noopener" class="project-card-link">
                <div class="project-img-wrap">
                    <img
                        class="project-card-img"
                        src="${imgSrc}"
                        width="${imgW}"
                        height="${imgH}"
                        alt="${altText}"
                        ${lazyAttr ? `loading="lazy"` : ''}
                        onerror="${imgErrorHandler}"
                    >
                    ${IMG_FALLBACK_HTML(repoName)}
                    <span class="project-overlay" aria-hidden="true">
                        <span class="project-overlay-text">View on GitHub${EXTERNAL_LINK_SVG}</span>
                    </span>
                </div>
                <div class="project-card-body">
                    <div class="project-card-header">
                        <h3 class="project-card-title">${repoName}</h3>
                        ${siteLabel}
                    </div>
                    ${descLine}
                    ${langLine ? `<div class="project-tags">${langLine}</div>` : ''}
                </div>
            </a>
        </article>
        `;
    }).join('');
}

loadProjects();

// About carousel
(function() {
    const images = [
        'assets/images/people/jan/jd2.jpg',
        'assets/images/people/jan/jd3.jpg',
        'assets/images/people/jan/jd4.jpg',
        'assets/images/people/jan/jd5.jpg',
        'assets/images/people/jan/jd6.jpg',
        'assets/images/people/jan/jd7.jpg',
        'assets/images/people/jan/jd8.jpg',
        'assets/images/people/jan/profilePic.jpg'
    ];

    const main = document.getElementById('carouselMain');
    const border = document.getElementById('aboutImageBorder');
    const thumbsContainer = document.getElementById('carouselThumbs');
    if (!main || !border || !thumbsContainer) return;

    const thumbs = Array.from(thumbsContainer.querySelectorAll('.thumb'));
    let current = 0;
    let autoInterval = null;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(i) {
        current = ((i % images.length) + images.length) % images.length;
        main.src = images[current];

        main.style.opacity = '0';
        requestAnimationFrame(() => {
            main.style.opacity = '1';
        });

        thumbs.forEach((t, idx) => {
            if (idx === current) t.classList.add('active'); else t.classList.remove('active');
        });
        border.style.borderColor = 'var(--rule)';
        border.style.boxShadow = 'none';
    }

    function startAuto() {
        if (autoInterval) return;
        if (reducedMotion) return;
        autoInterval = setInterval(() => setActive(current + 1), 4000);
    }
    function pauseAuto() { if (autoInterval) { clearInterval(autoInterval); autoInterval = null; } }
    function resumeAuto() { if (!autoInterval && !reducedMotion) startAuto(); }
    function resetAuto() { pauseAuto(); setTimeout(startAuto, 2600); }

    thumbs.forEach((btn, idx) => {
        btn.addEventListener('click', () => { setActive(idx); resetAuto(); });
        btn.addEventListener('mouseenter', pauseAuto);
        btn.addEventListener('mouseleave', resumeAuto);
        btn.addEventListener('focus', pauseAuto);
        btn.addEventListener('blur', resumeAuto);
    });

    main.addEventListener('click', () => { setActive(current + 1); resetAuto(); });
    main.addEventListener('mouseenter', pauseAuto);
    main.addEventListener('mouseleave', resumeAuto);
    main.addEventListener('focus', pauseAuto);
    main.addEventListener('blur', resumeAuto);

    // initialize
    setActive(0);
    startAuto();
})();

// Hero logo modal
(function() {
    const modal = document.getElementById('logoModal');
    if (!modal) return;
    const openBtn = modal.querySelector('.hero-logo-link');
    const closeBtn = modal.querySelector('.logo-modal-close');
    const backdrop = modal.querySelector('.logo-modal-backdrop');

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (openBtn) openBtn.focus();
    }

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
})();
