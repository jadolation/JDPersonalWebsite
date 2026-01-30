// Load romantic content
// Content is loaded from romantic-content.js via script tag
// Access via window.romanticContent and window.techContent

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
        // Set active class immediately for visual feedback (underline)
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

// Theme Toggle Button (replaces scroll-to-top)
const themeToggleBtn = document.createElement('button');
themeToggleBtn.className = 'theme-toggle-btn';
themeToggleBtn.setAttribute('aria-label', 'Open romantic page');

function updateThemeIcon() {
    themeToggleBtn.innerHTML = '<i class="fas fa-heart theme-icon"></i>';
}

const savedTheme = localStorage.getItem('portfolio-theme');
const urlParams = new URLSearchParams(window.location.search);
const forceTech = urlParams.get('forceTech') === '1';

if (forceTech) {
    localStorage.setItem('portfolio-theme', 'techy');
}

if (!forceTech && savedTheme === 'romantic') {
    // Don't auto-redirect away from the main page; only navigate to romantic when the user clicks the button/link.
}
updateThemeIcon();

    document.body.appendChild(themeToggleBtn);

    // Make the toggle visible immediately so it's present in the hero section
    themeToggleBtn.classList.add('visible');

    // Keep legacy scroll behavior in sync (no-op since we force visible)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            themeToggleBtn.classList.add('visible');
        } else {
            themeToggleBtn.classList.add('visible');
        }
    });

themeToggleBtn.addEventListener('click', () => {
    localStorage.setItem('portfolio-theme', 'romantic');
    window.location.href = '../romantic-page/index.html';
});

// Content Swapping Function
function applyContentTheme(isRomantic) {
    const content = isRomantic ? window.romanticContent : window.techContent;
    
    if (!content) return;
    
    // Helper function for smooth content transition
    function setText(selector, text, useFade = true) {
        const el = document.querySelector(selector);
        if (!el) return;
        
        if (useFade) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                el.textContent = text;
                el.style.opacity = '1';
            }, 300);
        } else {
            el.textContent = text;
        }
    }
    
    function setHTML(selector, html, useFade = true) {
        const el = document.querySelector(selector);
        if (!el) return;
        
        if (useFade) {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                el.innerHTML = html;
                el.style.opacity = '1';
            }, 300);
        } else {
            el.innerHTML = html;
        }
    }
    
    // Update Hero Section
    if (content.hero) {
        setText('.hero-subtitle', content.hero.subtitle);
        setText('.hero-title', content.hero.title);
        
        // Update typing phrases
        if (content.hero.typing && window.phrases) {
            window.phrases = content.hero.typing;
        }
        
        // Update location
        const locationEl = document.querySelector('.hero-location');
        if (locationEl && content.hero.location) {
            const icon = isRomantic ? '<i class="fas fa-heart"></i>' : '<i class="fas fa-map-marker-alt"></i>';
            setHTML('.hero-location', `${icon} ${content.hero.location}`);
        }
        
        // Update buttons
        if (content.hero.buttons) {
            const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
            const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');
            
            if (primaryBtn && content.hero.buttons.primary) {
                if (isRomantic) {
                    primaryBtn.textContent = content.hero.buttons.primary;
                    primaryBtn.href = '../romantic-page/love-letters.html';
                } else {
                    primaryBtn.textContent = content.hero.buttons.primary;
                    primaryBtn.href = '#contact';
                }
            }
            
            if (secondaryBtn && content.hero.buttons.secondary) {
                setText('.hero-buttons .btn-secondary', content.hero.buttons.secondary, false);
            }
        }
    }
    
    // Update NFT Badge
    if (content.nftBadge) {
        setText('.nft-badge-title', content.nftBadge.title);
        setText('.nft-badge-status', content.nftBadge.status);
    }
    
    // Update Skills Section (only title and subtitle, not the actual skills)
    if (content.skills) {
        setText('.skills .section-title', content.skills.title);
        setText('.skills .section-subtitle', content.skills.subtitle);
        
        // If romantic theme has custom skills categories, render them
        if (isRomantic && content.skills.categories && content.skills.categories.length > 0) {
            renderRomanticSkills(content.skills.categories);
        } else if (!isRomantic) {
            restoreTechSkills();
        }
    }
    
    // Update Projects Section
    if (content.projects) {
        setText('.projects .section-title', content.projects.title);
        setText('.projects .section-subtitle', content.projects.subtitle);
        setText('.projects-automation-note p', content.projects.note);
    }
    
    // Update Contact Section
    if (content.contact) {
        setText('.contact .section-title', content.contact.title);
        setText('.contact .section-subtitle', content.contact.subtitle);
        
        // Update form placeholders
        if (content.contact.form) {
            const nameInput = document.querySelector('.contact-form input[type="text"]');
            const emailInput = document.querySelector('.contact-form input[type="email"]');
            const subjectInput = document.querySelector('.contact-form input[placeholder*="Subject"]');
            const messageTextarea = document.querySelector('.contact-form textarea');
            const submitBtn = document.querySelector('.contact-form .btn');
            
            if (nameInput && content.contact.form.namePlaceholder) {
                nameInput.placeholder = content.contact.form.namePlaceholder;
            }
            if (emailInput && content.contact.form.emailPlaceholder) {
                emailInput.placeholder = content.contact.form.emailPlaceholder;
            }
            if (subjectInput && content.contact.form.subjectPlaceholder) {
                subjectInput.placeholder = content.contact.form.subjectPlaceholder;
            }
            if (messageTextarea && content.contact.form.messagePlaceholder) {
                messageTextarea.placeholder = content.contact.form.messagePlaceholder;
            }
            if (submitBtn && content.contact.form.button) {
                submitBtn.textContent = content.contact.form.button;
            }
        }
    }
    
    // Update Footer
    if (content.footer && content.footer.text) {
        setText('.footer-content p', content.footer.text);
    }
}

// Store original skills HTML for restoration
let originalSkillsHTML = '';

function renderRomanticSkills(categories) {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid) return;
    
    // Save original HTML if not saved
    if (!originalSkillsHTML) {
        originalSkillsHTML = skillsGrid.innerHTML;
    }
    
    skillsGrid.style.opacity = '0';
    
    setTimeout(() => {
        skillsGrid.innerHTML = categories.map(category => `
            <div class="skill-category">
                <h3><i class="${category.icon}"></i> ${category.title}</h3>
                <div class="skill-items">
                    ${category.items.map(item => `
                        <div class="skill-item">
                            <div class="skill-icon">${item.icon}</div>
                            <span>${item.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        skillsGrid.style.opacity = '1';
    }, 300);
}

function restoreTechSkills() {
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsGrid || !originalSkillsHTML) return;
    
    skillsGrid.style.opacity = '0';
    
    setTimeout(() => {
        skillsGrid.innerHTML = originalSkillsHTML;
        skillsGrid.style.opacity = '1';
    }, 300);
}

// (Romantic mode now uses a dedicated page: ../romantic-page/index.html)

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
 
// Hero logo: link to NFT certificate (click navigates to SuiScan). Keep drag-to-move behavior; dragging will suppress navigation.
(function() {
    const logoLink = document.querySelector('.hero-logo-link');
    if (!logoLink) return;
    const logoImg = logoLink.querySelector('.hero-logo');
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let wasDragged = false;

    // If a drag happened, suppress the following click navigation
    logoLink.addEventListener('click', (e) => {
        if (wasDragged) {
            e.preventDefault();
            wasDragged = false;
            return;
        }
        // otherwise, allow default navigation to SuiScan
    });

    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDragging = false;
        wasDragged = false;
        startX = e.clientX;
        startY = e.clientY;
        logoLink.setPointerCapture && logoLink.setPointerCapture(e.pointerId);
        logoLink.classList.remove('dragging');
        if (logoImg) logoImg.style.pointerEvents = 'none';
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
            logoLink.classList.add('dragging');
        }
        if (isDragging) {
            logoLink.style.transition = 'none';
            logoLink.style.transform = `translate(${dx}px, ${dy}px)`;
        }
    }

    function onPointerUp(e) {
        try { logoLink.releasePointerCapture && logoLink.releasePointerCapture(e.pointerId); } catch(_) {}
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        if (isDragging) {
            wasDragged = true;
            logoLink.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1)';
            logoLink.style.transform = '';
            const cleanup = () => {
                logoLink.style.transition = '';
                logoLink.classList.remove('dragging');
                if (logoImg) logoImg.style.pointerEvents = '';
                logoLink.removeEventListener('transitionend', cleanup);
            };
            logoLink.addEventListener('transitionend', cleanup);
        } else {
            if (logoImg) logoImg.style.pointerEvents = '';
        }
        isDragging = false;
    }

    logoLink.addEventListener('pointerdown', onPointerDown);
})();

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

        const fallbackImageUrl = 'https://japanpowered.com/media/images//GurrenLagann-simon.jpg';

        const escapeHtml = (value) => String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');

        const githubOgImage = (repoUrl, repoName) => {
            // Use GitHub's Open Graph preview image. This works even when the repo doesn't
            // have a custom "social preview" image; GitHub generates one.
            // Format: https://opengraph.githubassets.com/<salt>/<owner>/<repo>
            const defaultOwner = 'jadolation';
            let owner = defaultOwner;
            let name = repoName;
            try {
                const u = new URL(repoUrl);
                const parts = u.pathname.split('/').filter(Boolean);
                if (parts.length >= 2) {
                    owner = parts[0];
                    name = parts[1];
                }
            } catch (_) {
                // ignore
            }
            return `https://opengraph.githubassets.com/1/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
        };

        if (!grid) {
            // Fallback: replace #projects section if grid isn't present
            const container = document.getElementById('projects');
            if (!container) return;
            container.innerHTML = projects.map(repo => `
                <div class="project-card" data-aos="fade-up">
                    <div class="project-content">
                        <h3>${escapeHtml(repo.name)}</h3>
                        <p>${escapeHtml(repo.description || 'No description provided.')}</p>
                        <div class="project-tags">
                            ${repo.language ? `<span class="tag">${escapeHtml(repo.language)}</span>` : ''}
                        </div>
                        <a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener">View on GitHub</a>
                    </div>
                </div>
            `).join('');
            return;
        }

        grid.innerHTML = projects.map((repo, idx) => {
            const repoName = escapeHtml(repo.name);
            const repoUrl = escapeHtml(repo.url);
            const repoDesc = escapeHtml(repo.description || 'No description provided.');
            const repoLang = repo.language ? escapeHtml(repo.language) : '';
            let homepageUrl = repo.homepage ? escapeHtml(repo.homepage) : '';
            const imgUrl = githubOgImage(repo.url, repo.name);
            
            const isPersonalWebsite = repo.name === 'JDPersonalWebsite';
            const isNFTProject = repo.name.toLowerCase().includes('nft') || repo.name === 'my_coin_template';
            const suiscanUrl = 'https://suiscan.xyz/testnet/object/0x53a570961334e517cfef15e703ef300e6d59da322eaa6bd4763d19e329b8a52c/tx-blocks';
            
            if (isNFTProject && !homepageUrl) {
                homepageUrl = suiscanUrl;
            }
            
            const specialNote = isPersonalWebsite 
                ? '<div class="project-special-note"><i class="fas fa-info-circle"></i> You are currently viewing this project!</div>' 
                : '';

            return `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${100 + (idx * 100)}">
                <div class="project-image">
                    <img
                        src="${imgUrl}"
                        alt="${repoName}"
                        loading="lazy"
                        decoding="async"
                        referrerpolicy="no-referrer"
                        onerror="this.onerror=null;this.src='${fallbackImageUrl}';"
                    >
                    <div class="project-overlay">
                        ${specialNote}
                        <div class="project-links">
                            <a href="${repoUrl}" target="_blank" rel="noopener" class="project-link" aria-label="View ${repoName} on GitHub"><i class="fab fa-github"></i></a>
                            ${homepageUrl ? `<a href="${homepageUrl}" target="_blank" rel="noopener" class="project-link" aria-label="${isNFTProject ? 'View NFT certificate on SuiScan' : 'Open ' + repoName + ' demo'}"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-content">
                    <h3>${repoName}</h3>
                    <p>${repoDesc}</p>
                    <div class="project-tags">
                        ${repoLang ? `<span class="tag">${repoLang}</span>` : ''}
                    </div>
                </div>
            </div>
            `;
        }).join('');
}

loadProjects();
