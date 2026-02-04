// Valentine's Letter JavaScript
let currentPage = 1;
const totalPages = 5;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showPage(1);
    setupPageIndicators();
});

// Show specific page
function showPage(pageNum) {
    // Hide all pages
    const pages = document.querySelectorAll('.book-page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`page${pageNum}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageNum;
        updateIndicators();
        
        // Restart flower animation when returning to page 1
        if (pageNum === 1) {
            restartFlowerAnimation();
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Navigate to next page
function nextPage() {
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

// Navigate to previous page
function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// Restart letter from beginning
function restartLetter() {
    showPage(1);
}

// Setup page indicator click handlers
function setupPageIndicators() {
    const indicators = document.querySelectorAll('.indicator-dot');
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showPage(index + 1);
        });
    });
}

// Update page indicators
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator-dot');
    indicators.forEach((dot, index) => {
        if (index + 1 === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Restart flower animation
function restartFlowerAnimation() {
    const petals = document.querySelectorAll('.petal');
    const center = document.querySelector('.flower-center');
    const stem = document.querySelector('.flower-stem');
    
    // Remove and re-add elements to restart animation
    petals.forEach(petal => {
        petal.style.animation = 'none';
        setTimeout(() => {
            petal.style.animation = '';
        }, 10);
    });
    
    if (center) {
        center.style.animation = 'none';
        setTimeout(() => {
            center.style.animation = '';
        }, 10);
    }
    
    if (stem) {
        stem.style.animation = 'none';
        setTimeout(() => {
            stem.style.animation = '';
        }, 10);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
    } else if (e.key === 'Home') {
        showPage(1);
    } else if (e.key === 'End') {
        showPage(totalPages);
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            nextPage();
        } else {
            // Swipe right - previous page
            prevPage();
        }
    }
}

// Add floating hearts animation on final page
function createFloatingHeart() {
    const heart = document.createElement('i');
    heart.className = 'fas fa-heart';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.bottom = '-50px';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.color = 'rgba(220, 20, 60, 0.6)';
    heart.style.animation = `floatUp ${Math.random() * 3 + 3}s linear`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Add CSS for floating hearts
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Create hearts periodically on final page
let heartInterval;

function startHeartAnimation() {
    heartInterval = setInterval(() => {
        if (currentPage === 5) {
            createFloatingHeart();
        }
    }, 1000);
}

function stopHeartAnimation() {
    if (heartInterval) {
        clearInterval(heartInterval);
    }
}

// Start heart animation when ready
window.addEventListener('load', () => {
    startHeartAnimation();
});

// Log for debugging
console.log('Valentine\'s Letter initialized with love 💕');
