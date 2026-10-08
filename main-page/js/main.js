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
function setMenuOpen(open) {
    navMenu.classList.toggle('active', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('active'));
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        setMenuOpen(false);
    });
});

// Close on Escape (focus returns to the toggle) and on outside tap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuOpen(false);
        navToggle.focus();
    }
});
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active')
        && !navMenu.contains(e.target)
        && !navToggle.contains(e.target)) {
        setMenuOpen(false);
    }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        // Skip hidden sections (e.g. #valentine is display:none, so its
        // offsetTop reads 0 and would otherwise claim every scroll position).
        if (section.clientHeight === 0) return;
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        const hashIndex = href.indexOf('#');
        const targetId = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
        if (targetId !== '' && targetId === current) {
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

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
        }
        if (formStatus) {
            formStatus.textContent = 'Sending your message…';
            formStatus.className = 'form-status';
        }

        fetch('https://formsubmit.co/ajax/zaratejandale15@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: data.subject || 'Portfolio contact form',
                message: data.message,
                _honey: data._honey || '',
                _captcha: 'false',
                _template: 'table',
                _subject: 'Portfolio contact: ' + (data.subject || 'New message')
            })
        })
            .then((res) => res.json().then((json) => ({ ok: res.ok, json })).catch(() => ({ ok: res.ok, json: {} })))
            .then(({ ok, json }) => {
                if (!ok || (json && json.success === 'false')) {
                    throw new Error((json && json.message) || 'Send failed.');
                }
                if (formStatus) {
                    formStatus.textContent = 'Thanks — your message was sent. I\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                }
                contactForm.reset();
                setTimeout(() => {
                    if (formStatus) {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                    }
                }, 8000);
            })
            .catch(() => {
                if (formStatus) {
                    formStatus.textContent = 'Couldn\'t send just now — please email me directly at zaratejandale15@gmail.com.';
                    formStatus.className = 'form-status error';
                }
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
    });
}

// Console messages
console.log('%c Hello, Developer!', 'font-size: 20px; color: #8DB4FF; font-weight: bold;');
console.log('%cWelcome to my portfolio. Looking for something?', 'font-size: 14px; color: #9BA4B8;');
console.log('%cFeel free to reach out: zaratejandale15@gmail.com', 'font-size: 12px; color: #F0CE86;');

// Projects section: merged panels (synced GitHub repos + manual entries)
const GITHUB_OWNER = 'jadolation';

function projectsSafeUrl(value) {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : '';
}

// GitHub mark (exact Simple Icons path, also used by the social links)
function githubMarkSvg(fill, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="' + fill + '" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';
}

async function loadProjects() {
    const panelsEl = document.getElementById('projectsPanels');
    const stripEl = document.getElementById('projectsStrip');
    if (!panelsEl || !stripEl) return;

    const escapeHtml = (value) => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    panelsEl.innerHTML = '<p class="projects-loading">Loading projects…</p>';
    stripEl.hidden = true;
    stripEl.innerHTML = '';

    const showPlaceholders = /[?&]placeholders=1\b/.test(window.location.search);
    let syncedFailed = false;

    async function fetchJson(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    }

    let syncedRaw = [];
    try {
        const data = await fetchJson('./projects.json');
        if (Array.isArray(data)) syncedRaw = data;
    } catch {
        syncedFailed = true;
    }

    let manualDoc = null;
    try {
        const data = await fetchJson('./data/projects-manual.json');
        if (data && typeof data === 'object') manualDoc = data;
    } catch {
        manualDoc = null;
    }

    const overrides = (manualDoc && manualDoc.overrides && typeof manualDoc.overrides === 'object')
        ? manualDoc.overrides
        : {};

    function repoOwner(url) {
        const match = typeof url === 'string' && url.match(/github\.com\/([^/]+)/);
        return match ? match[1] : '';
    }

    function activityText(stars, forks) {
        const s = `${stars} star${stars === 1 ? '' : 's'}`;
        const f = `${forks} fork${forks === 1 ? '' : 's'}`;
        return `${s}, ${f}`;
    }

    // Normalize synced repos, applying overrides keyed by exact repo name.
    const normalized = [];
    syncedRaw.forEach((repo, pinnedIndex) => {
        if (!repo || typeof repo.name !== 'string') return;
        const over = (overrides[repo.name] && typeof overrides[repo.name] === 'object')
            ? overrides[repo.name]
            : {};
        if (over.hidden === true) return;
        const stars = typeof repo.stars === 'number' ? repo.stars : 0;
        const forks = typeof repo.forks === 'number' ? repo.forks : 0;
        normalized.push({
            key: 'repo:' + repo.name,
            sourceOrder: 1000 + pinnedIndex,
            name: typeof over.displayName === 'string' && over.displayName ? over.displayName : repo.name,
            description: Object.prototype.hasOwnProperty.call(over, 'description') ? over.description : repo.description,
            website: projectsSafeUrl(over.website),
            repoUrl: projectsSafeUrl(repo.url),
            logo: typeof over.logo === 'string' && over.logo ? over.logo : repo.logo,
            logoPlate: over.logoPlate === 'dark' || over.logoPlate === 'light' ? over.logoPlate : repo.logoPlate,
            preview: repo.preview,
            ownership: typeof over.ownership === 'string' && over.ownership
                ? over.ownership
                : (repoOwner(repo.url) === GITHUB_OWNER ? 'Owner' : 'Contributor'),
            status: typeof over.status === 'string' ? over.status : '',
            role: typeof over.role === 'string' ? over.role : '',
            stack: typeof over.stack === 'string' ? over.stack : '',
            language: repo.language,
            activity: activityText(stars, forks),
            extraFacts: Array.isArray(over.facts) ? over.facts : [],
            order: typeof over.order === 'number' ? over.order : 100 + pinnedIndex,
            isThisSite: repo.name === 'JDPersonalWebsite'
        });
    });

    // Normalize manual entries (link-only projects).
    if (manualDoc && Array.isArray(manualDoc.projects)) {
        manualDoc.projects.forEach((entry) => {
            if (!entry || typeof entry !== 'object') return;
            if (entry.placeholder === true && !showPlaceholders) return;
            if (typeof entry.name !== 'string' || !entry.name) return;
            const website = projectsSafeUrl(entry.website);
            const repoUrl = projectsSafeUrl(entry.repoUrl);
            if (!website && !repoUrl) return;
            const extraFacts = Array.isArray(entry.facts)
                ? entry.facts.filter((f) => f && typeof f.label === 'string' && typeof f.value === 'string')
                : [];
            normalized.push({
                key: 'manual:' + (typeof entry.slug === 'string' && entry.slug ? entry.slug : entry.name),
                sourceOrder: normalized.length,
                name: entry.name,
                description: typeof entry.description === 'string' ? entry.description : '',
                website,
                repoUrl,
                logo: typeof entry.logo === 'string' && entry.logo ? entry.logo : null,
                logoPlate: entry.logoPlate === 'dark' ? 'dark' : 'light',
                preview: null,
                ownership: typeof entry.ownership === 'string' ? entry.ownership : '',
                status: typeof entry.status === 'string' ? entry.status : '',
                role: typeof entry.role === 'string' ? entry.role : '',
                stack: typeof entry.stack === 'string' ? entry.stack : '',
                language: typeof entry.language === 'string' ? entry.language : '',
                activity: '',
                extraFacts,
                order: typeof entry.order === 'number' ? entry.order : 50,
                isThisSite: false
            });
        });
    }

    // Ascending order; stable sort keeps manual-before-synced on ties.
    normalized.forEach((p, i) => { p.tiebreak = i; });
    normalized.sort((a, b) => (a.order - b.order) || (a.tiebreak - b.tiebreak));

    // Public list for future consumers (terminal/chatbot read this, not the DOM).
    window.portfolioProjects = normalized.map((p) => ({
        name: p.name,
        description: p.description || '',
        language: p.language || '',
        stack: p.stack || '',
        link: p.website || p.repoUrl || '',
        ownership: p.ownership || '',
        status: p.status || ''
    }));

    if (normalized.length === 0) {
        panelsEl.innerHTML = syncedFailed
            ? '<p class="projects-error">Couldn\'t load projects — see <a href="https://github.com/jadolation">github.com/jadolation</a>.</p>'
            : '<p class="projects-error">No projects to show yet — see <a href="https://github.com/jadolation">github.com/jadolation</a>.</p>';
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function mediaBlock(p, eager) {
        const name = escapeHtml(p.name);
        const lazy = eager ? '' : ' loading="lazy"';
        const fallback = `<div class="projects-media-fallback" aria-hidden="true">${name}</div>`;
        const swap = `this.style.display='none';this.nextElementSibling.style.display='flex';`;
        if (p.logo) {
            const plate = p.logoPlate === 'dark' ? 'dark' : 'light';
            return `<div class="projects-media projects-media--logo" data-plate="${plate}">`
                + `<img class="project-logo" src="./${escapeHtml(p.logo)}" alt="${name} logo" decoding="async"${lazy} onerror="${swap}">`
                + fallback + `</div>`;
        }
        if (p.preview) {
            return `<div class="projects-media">`
                + `<img class="projects-preview-img" src="./${escapeHtml(p.preview)}" alt="${name} preview" decoding="async"${lazy} onerror="${swap}">`
                + fallback + `</div>`;
        }
        const plate = p.logoPlate === 'dark' ? 'dark' : 'light';
        const markFill = plate === 'dark' ? 'var(--text)' : 'var(--space)';
        return `<div class="projects-media projects-media--logo" data-plate="${plate}">`
            + githubMarkSvg(markFill, 'projects-gh-mark') + `</div>`;
    }

    function factsBlock(p) {
        const rows = [];
        const row = (label, value) => {
            if (typeof value !== 'string' || !value) return;
            rows.push(`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`);
        };
        row('Ownership', p.ownership);
        row('Status', p.status);
        row('My role', p.role);
        row('Stack', p.stack);
        row('Language', p.language);
        row('Activity', p.activity);
        p.extraFacts.forEach((f) => row(f.label, f.value));
        if (!rows.length) return '';
        return `<dl class="projects-facts">${rows.join('')}</dl>`;
    }

    function ctaBlock(p) {
        const buttons = [];
        if (p.website) {
            buttons.push(`<a class="btn btn-primary projects-cta" href="${escapeHtml(p.website)}" target="_blank" rel="noopener noreferrer">Visit website</a>`);
        } else if (p.repoUrl) {
            buttons.push(`<a class="btn btn-primary projects-cta" href="${escapeHtml(p.repoUrl)}" target="_blank" rel="noopener noreferrer">View on GitHub</a>`);
        }
        if (p.website && p.repoUrl) {
            buttons.push(`<a class="projects-gh-link" href="${escapeHtml(p.repoUrl)}" target="_blank" rel="noopener noreferrer">View on GitHub</a>`);
        }
        if (!buttons.length) return '';
        return `<div class="projects-cta-row">${buttons.join('')}</div>`;
    }

    panelsEl.innerHTML = normalized.map((p, i) => {
        const name = escapeHtml(p.name);
        const desc = (typeof p.description === 'string' && p.description)
            ? `<p class="projects-intro">${escapeHtml(p.description)}</p>` : '';
        const facts = factsBlock(p);
        const cta = ctaBlock(p);
        const label = p.isThisSite ? '<span class="projects-site-label">This site</span>' : '';
        const main = (desc || facts)
            ? `<div class="projects-main">${desc}${facts}</div>` : '';
        return `<article class="projects-panel" id="projects-panel-${i}" role="tabpanel" aria-labelledby="projects-tab-${i}"${i === 0 ? ' data-active' : ''}>`
            + `<div class="projects-side">${mediaBlock(p, i === 0)}`
            + `<h3 class="projects-name">${name}${label}</h3>${cta}</div>${main}</article>`;
    }).join('');

    // Logo strip (hidden for a single project).
    if (normalized.length > 1) {
        stripEl.hidden = false;
        stripEl.innerHTML = normalized.map((p, i) => {
            const name = escapeHtml(p.name);
            const inner = p.logo
                ? `<img src="./${escapeHtml(p.logo)}" alt="" width="200" height="64">`
                : githubMarkSvg('var(--space)', 'projects-cell-mark');
            const dark = p.logoPlate === 'dark' ? ' projects-cell--dark' : '';
            return `<button type="button" role="tab" id="projects-tab-${i}" aria-controls="projects-panel-${i}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}" aria-label="${name}" class="projects-cell${dark}">${inner}</button>`;
        }).join('');
    } else {
        stripEl.hidden = true;
        stripEl.innerHTML = '';
    }

    const panels = Array.from(panelsEl.querySelectorAll('.projects-panel'));
    const tabs = Array.from(stripEl.querySelectorAll('[role="tab"]'));

    function activate(index) {
        panels.forEach((panel, i) => {
            panel.toggleAttribute('data-active', i === index);
        });
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
            tab.setAttribute('tabindex', active ? '0' : '-1');
        });
    }

    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => activate(idx));
        tab.addEventListener('keydown', (e) => {
            let target = -1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = idx + 1;
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = idx - 1;
            else if (e.key === 'Home') target = 0;
            else if (e.key === 'End') target = tabs.length - 1;
            else if (e.key === 'Enter' || e.key === ' ') target = idx;
            else return;
            e.preventDefault();
            target = ((target % tabs.length) + tabs.length) % tabs.length;
            tabs[target].focus();
            activate(target);
        });
    });

    // Pin each CTA row so its vertical center sits on the last facts
    // row's center (CSS margin-top:auto handles the common case; this
    // only corrects panels whose last row wraps taller than the button).
    function pinButtons() {
        panels.forEach((panel) => {
            const facts = panel.querySelector('.projects-facts');
            const ctaRow = panel.querySelector('.projects-cta-row');
            const side = panel.querySelector('.projects-side');
            if (!facts || !ctaRow || !side) return;
            const lastRow = facts.lastElementChild;
            if (!lastRow) return;
            const pad = Math.max(0, (lastRow.getBoundingClientRect().height - ctaRow.getBoundingClientRect().height) / 2);
            side.style.paddingBottom = pad > 1 ? pad.toFixed(1) + 'px' : '';
        });
    }
    pinButtons();
    if (!reducedMotion && window.ResizeObserver) {
        let scheduled = false;
        const ro = new ResizeObserver(() => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => { scheduled = false; pinButtons(); });
        });
        panels.forEach((panel) => ro.observe(panel));
    }
    window.addEventListener('resize', pinButtons);
    window.addEventListener('load', pinButtons);
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
        const activeThumb = thumbs[current];
        if (activeThumb && typeof activeThumb.scrollIntoView === 'function') {
            activeThumb.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
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

    // Touch swipe on the main image (mouse hover pause never fires on touch)
    let touchStartX = null;
    main.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
        pauseAuto();
    }, { passive: true });
    main.addEventListener('touchend', (e) => {
        if (touchStartX !== null) {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) setActive(current + (dx < 0 ? 1 : -1));
        }
        touchStartX = null;
        resetAuto();
    });

    // initialize
    setActive(0);
    startAuto();
})();
