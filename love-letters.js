// Password for writing letters (change this to your secret password!)
const AUTHOR_PASSWORD = "myspecialsecret123"; // CHANGE THIS!

// Navigation mobile toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// localStorage key for letters
const LETTERS_STORAGE_KEY = 'loveLetters';

// Sample welcome letter data
const welcomeLetter = {
    id: 'welcome',
    title: 'Welcome My Love 💕',
    content: `Hello Beautiful,

Welcome to our special place! This is where I can write letters just for you, letters filled with all the things I want to say but sometimes can't find the words for in person.

Every letter here is written from my heart to yours. You can read them anytime you want, whenever you need a reminder of how much you mean to me.

I created this space because you deserve something special, something that's just ours. A place where my words can live forever, where you can come back and read them whenever you need a smile, a hug, or just to feel loved.

I hope every time you visit here, you feel how much I care about you, how much you brighten my days, and how grateful I am to have you in my life.

I also want to say I'm sorry for what happened last night. I never meant to upset you, and I hope we can talk it through when you're ready. You mean the world to me, and I want to make things right.

You didn't deserve what happened, and I promise to do better. Please know that my love for you is endless, and I'm here for you always.

You are my everything, and I love you more than words can express.

With all my love,
With love, Jan Dale D. Zarate`,
    author: 'Jan Dale D. Zarate',
    date: 'January 27, 2026'
};

// Initialize letters from localStorage
function getLetters() {
    const stored = localStorage.getItem(LETTERS_STORAGE_KEY);
    if (!stored) {
        // Initialize with welcome letter
        const letters = [welcomeLetter];
        localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(letters));
        return letters;
    }
    return JSON.parse(stored);
}

function saveLetters(letters) {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(letters));
}

// Render letters grid
function renderLetters() {
    const letters = getLetters();
    const grid = document.getElementById('lettersGrid');
    const emptyState = document.getElementById('lettersEmpty');
    
    if (!grid) return;
    
    if (letters.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    // Clear existing cards except the sample one if it exists
    grid.innerHTML = '';
    
    letters.forEach(letter => {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.setAttribute('data-letter-id', letter.id);
        
        card.innerHTML = `
            <div class="letter-card-front">
                <div class="letter-envelope">
                    <i class="fas fa-envelope"></i>
                </div>
                <h3 class="letter-card-title">${escapeHtml(letter.title)}</h3>
                <p class="letter-date">${escapeHtml(letter.date)}</p>
                <button class="btn-open-letter">
                    <i class="fas fa-envelope-open"></i> Open Letter
                </button>
            </div>
        `;
        
        card.querySelector('.btn-open-letter').addEventListener('click', (e) => {
            e.stopPropagation();
            openLetter(letter.id);
        });
        
        card.addEventListener('click', () => {
            openLetter(letter.id);
        });
        
        grid.appendChild(card);
    });
}

// Open letter modal
function openLetter(letterId) {
    const letters = getLetters();
    const letter = letters.find(l => l.id === letterId);
    
    if (!letter) return;
    
    const modal = document.getElementById('letterModal');
    const title = document.getElementById('modalLetterTitle');
    const date = document.getElementById('modalLetterDate');
    const content = document.getElementById('modalLetterContent');
    const author = document.getElementById('modalLetterAuthor');
    const deleteBtn = document.getElementById('deleteLetterBtn');
    
    if (!modal) return;
    
    title.textContent = letter.title;
    date.textContent = letter.date;
    content.textContent = letter.content;
        // Insert signature text and a signature image placeholder
        author.innerHTML = `
            <div class="letter-signature">
                <p>With love, ${escapeHtml(letter.author)}</p>
                <img src="assets/pictures/Jan%20Dale%20Zarate%20-%20%20Signature.png" alt="Signature image" class="signature-image" onerror="this.style.display='none'" />
            </div>
        `;
    
    // Show delete button only for non-welcome letters
    if (deleteBtn) {
        deleteBtn.style.display = letter.id === 'welcome' ? 'none' : 'inline-flex';
        deleteBtn.onclick = () => deleteLetter(letter.id);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close letter modal
function closeLetter() {
    const modal = document.getElementById('letterModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Delete letter
function deleteLetter(letterId) {
    if (letterId === 'welcome') return; // Prevent deleting welcome letter
    
    if (!confirm('Are you sure you want to delete this letter? This cannot be undone.')) {
        return;
    }
    
    let letters = getLetters();
    letters = letters.filter(l => l.id !== letterId);
    saveLetters(letters);
    renderLetters();
    closeLetter();
}

// Modal close handlers
const closeModalBtn = document.getElementById('closeModal');
const modalBackdrop = document.querySelector('.letter-modal-backdrop');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeLetter);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeLetter);
}

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLetter();
    }
});

// Write letter toggle
const writeToggle = document.getElementById('writeLetterToggle');
const writeForm = document.getElementById('writeLetterForm');
const passwordGate = document.getElementById('passwordGate');
const letterEditor = document.getElementById('letterEditor');
const passwordInput = document.getElementById('authorPassword');
const unlockBtn = document.getElementById('unlockBtn');
const passwordError = document.getElementById('passwordError');
const cancelBtn = document.getElementById('cancelBtn');

if (writeToggle && writeForm) {
    writeToggle.addEventListener('click', () => {
        const isVisible = writeForm.style.display === 'block';
        writeForm.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Reset form
            if (passwordGate) passwordGate.style.display = 'block';
            if (letterEditor) letterEditor.style.display = 'none';
            if (passwordInput) passwordInput.value = '';
            if (passwordError) passwordError.style.display = 'none';
        }
    });
}

// Password unlock
if (unlockBtn && passwordInput) {
    unlockBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        
        if (password === AUTHOR_PASSWORD) {
            if (passwordGate) passwordGate.style.display = 'none';
            if (letterEditor) letterEditor.style.display = 'block';
            if (passwordError) passwordError.style.display = 'none';
        } else {
            if (passwordError) passwordError.style.display = 'block';
            passwordInput.value = '';
            
            // Shake animation
            if (passwordInput) {
                passwordInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    passwordInput.style.animation = '';
                }, 500);
            }
        }
    });
    
    // Enter key to unlock
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            unlockBtn.click();
        }
    });
}

// Cancel button
if (cancelBtn && writeForm) {
    cancelBtn.addEventListener('click', () => {
        writeForm.style.display = 'none';
        document.getElementById('newLetterForm').reset();
    });
}

// New letter form submission
const newLetterForm = document.getElementById('newLetterForm');
if (newLetterForm) {
    newLetterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('letterTitle').value;
        const content = document.getElementById('letterContent').value;
        const author = document.getElementById('letterAuthor').value;
        
        const newLetter = {
            id: 'letter_' + Date.now(),
            title,
            content,
            author,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        const letters = getLetters();
        letters.unshift(newLetter); // Add to beginning
        saveLetters(letters);
        
        // Reset form and hide
        newLetterForm.reset();
        if (writeForm) writeForm.style.display = 'none';
        
        // Re-render letters
        renderLetters();
        
        // Show success message
        alert('💕 Your letter has been saved! She can read it now.');
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Initialize on load
window.addEventListener('load', () => {
    renderLetters();
});
