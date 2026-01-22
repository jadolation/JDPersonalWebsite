// ============================================
// Initialize AOS (Animate on Scroll)
// ============================================
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ============================================
// Navigation
// ============================================
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

// ============================================
// Typing Effect
// ============================================
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

// ============================================
// Smooth Scrolling
// ============================================
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

// ============================================
// Form Submission
// ============================================
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

// ============================================
// Particle Animation (Optional Enhancement)
// ============================================
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

// Create particles on load
window.addEventListener('load', createParticles);

// ============================================
// Scroll to Top Button (Optional)
// ============================================
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

// ============================================
// Project Cards Animation Enhancement
// ============================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ============================================
// Console Message
// ============================================
console.log('%c👋 Hello, Developer!', 'font-size: 20px; color: #00d4ff; font-weight: bold;');
console.log('%cWelcome to my portfolio. Looking for something? 🔍', 'font-size: 14px; color: #a0a8b8;');
console.log('%cFeel free to reach out: your.email@example.com', 'font-size: 12px; color: #00ff88;');
 
// ============================================
// Hero Logo Interactivity (modal viewer + keyboard)
// ============================================
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
