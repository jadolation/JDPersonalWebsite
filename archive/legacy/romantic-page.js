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

    updateLink('icon', 'assets/images/favicons/kr/favicon_io/favicon.ico');
    updateLink('icon', 'assets/images/favicons/kr/favicon_io/favicon-16x16.png', '16x16');
    updateLink('icon', 'assets/images/favicons/kr/favicon_io/favicon-32x32.png', '32x32');
    updateLink('apple-touch-icon', 'assets/images/favicons/kr/favicon_io/apple-touch-icon.png');
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

// Confirmation modal elements
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmText = document.getElementById('confirmText');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

// Funny rejection questions - progressively more persuasive
const rejectionQuestions = [
    {
        title: "Are you sure? 🥺",
        text: "You're breaking my heart! Think about all the fun we'll have together! 💔"
    },
    {
        title: "Really? Like, REALLY sure? 😢",
        text: "I made this whole website for you! That's gotta count for something, right? 💻✨"
    },
    {
        title: "But why though? 🤔",
        text: "I promise I'll be the best Valentine ever! We can watch anime together! 🎌"
    },
    {
        title: "Can you reconsider? 🙏",
        text: "Even Bandit thinks we'd be great together! He's a good judge of character! 🐾"
    },
    {
        title: "One more chance? 💕",
        text: "I'll take you on amazing dates! Coffee, walks, crime documentaries... anything you want! ☕"
    },
    {
        title: "Please? Pretty please? 🥹",
        text: "I've been practicing my 'romantic boyfriend' skills just for this moment! 💪"
    },
    {
        title: "Is this a test? 😅",
        text: "Because I'm pretty sure the right answer is 'Yes'... Just saying! 😉"
    },
    {
        title: "Final answer? 🎯",
        text: "I'll even let you pick all the shows we watch! How's that for a deal? 📺"
    },
    {
        title: "Come on now... 😊",
        text: "You know you want to say yes. I can see it in your smile! ✨"
    },
    {
        title: "Last chance! 💫",
        text: "If you say no, I'll just keep asking until you say yes anyway... Save us both the time? 😄"
    }
];

let currentQuestionIndex = 0;
let modalActive = false;

function showValentineResponse(text) {
    if (buttonsWrap) buttonsWrap.style.display = 'none';
    if (responseText) responseText.textContent = text;
    if (responseWrap) responseWrap.style.display = 'block';
    createHearts(22);
    closeConfirmModal(); // Close modal if open
}

function showConfirmModal() {
    if (modalActive) return; // Prevent multiple modals
    
    modalActive = true;
    const question = rejectionQuestions[currentQuestionIndex % rejectionQuestions.length];
    
    if (confirmTitle) confirmTitle.textContent = question.title;
    if (confirmText) confirmText.textContent = question.text;
    
    if (confirmModal) {
        confirmModal.style.display = 'flex';
        // Trigger reflow for animation
        confirmModal.offsetHeight;
    }
    
    currentQuestionIndex++;
}

function closeConfirmModal() {
    if (confirmModal) {
        confirmModal.style.display = 'none';
    }
    modalActive = false;
}

// Handle "Yes! 💕" button - direct acceptance
if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        showValentineResponse('You just made me the happiest person in the world! 💖✨🎉');
    });
}

// Handle "Let me think" button - show confirmation
if (maybeBtn) {
    maybeBtn.addEventListener('click', () => {
        showConfirmModal();
    });
}

// Handle confirmation "Yes, I'm sure" - show next question
if (confirmYes) {
    confirmYes.addEventListener('click', () => {
        // Always advance to the next persuasive question and keep asking.
        // Close then reopen the modal to show the next question (reused single modal).
        closeConfirmModal();
        // Small delay for smoother transition
        setTimeout(() => showConfirmModal(), 300);
    });
}

// Handle confirmation "No, wait!" - accept being Valentine
if (confirmNo) {
    confirmNo.addEventListener('click', () => {
        closeConfirmModal();
        showValentineResponse('I knew you couldn\'t resist! You just made me the happiest person ever! 💖✨🎉');
    });
}

// Close modal on backdrop click
if (confirmModal) {
    const backdrop = confirmModal.querySelector('.confirm-modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeConfirmModal();
        });
    }
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

// Initialize "About Her" carousel
(function initHerCarousel() {
    const carousel = document.getElementById('herCarousel');
    if (!carousel) return;

    const main = carousel.querySelector('#herCarouselMain');
    const border = carousel.querySelector('#herImageBorder');
    const thumbs = Array.from(carousel.querySelectorAll('.thumb'));

    if (!main || thumbs.length === 0) return;

    let current = 0;
    let autoInterval = null;

    const colors = [
        '#ff6b9d',  // Pink
        '#ff8fab',  // Light pink
        '#ffa8c5',  // Lighter pink
        '#c77dff',  // Purple
        '#ff94d6'   // Rose pink
    ];

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function setActive(index) {
        current = index % thumbs.length;
        const src = thumbs[current].getAttribute('data-src');
        if (src) main.src = src;

        thumbs.forEach((btn, idx) => {
            if (idx === current) {
                btn.classList.add('active');
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.classList.remove('active');
                btn.style.transform = 'scale(1)';
            }
        });

        if (border) {
            const color = colors[current % colors.length];
            border.style.borderColor = color;
            border.style.boxShadow = `0 12px 40px ${hexToRgba(color, 0.12)}`;
        }
    }

    function startAuto() {
        if (autoInterval) return;
        autoInterval = setInterval(() => setActive(current + 1), 4000);
    }

    function pauseAuto() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }

    function resumeAuto() {
        if (!autoInterval) startAuto();
    }

    function resetAuto() {
        pauseAuto();
        setTimeout(startAuto, 2600);
    }

    thumbs.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            setActive(idx);
            resetAuto();
        });
        btn.addEventListener('mouseenter', pauseAuto);
        btn.addEventListener('mouseleave', resumeAuto);
    });

    main.addEventListener('click', () => {
        setActive(current + 1);
        resetAuto();
    });
    main.addEventListener('mouseenter', pauseAuto);
    main.addEventListener('mouseleave', resumeAuto);

    // Initialize
    setActive(0);
    startAuto();
})();
