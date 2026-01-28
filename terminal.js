// Interactive Terminal with Dynamic Content Extraction
class InteractiveTerminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.output = this.container.querySelector('.terminal-output');
        this.input = this.container.querySelector('.terminal-input');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';
        
        this.commands = {
            help: this.helpCommand.bind(this),
            about: this.aboutCommand.bind(this),
            contact: this.contactCommand.bind(this),
            skills: this.skillsCommand.bind(this),
            projects: this.projectsCommand.bind(this),
            srv: this.srvCommand.bind(this),
            social: this.socialCommand.bind(this),
            clear: this.clearCommand.bind(this),
            cv: this.cvCommand.bind(this),
            resume: this.cvCommand.bind(this),
            email: this.emailCommand.bind(this),
            github: this.githubCommand.bind(this),
            linkedin: this.linkedinCommand.bind(this),
            ls: this.lsCommand.bind(this),
            pwd: this.pwdCommand.bind(this),
            cd: this.cdCommand.bind(this),
            cat: this.catCommand.bind(this),
            whoami: this.whoamiCommand.bind(this),
            date: this.dateCommand.bind(this),
            echo: this.echoCommand.bind(this),
            sudo: this.sudoCommand.bind(this),
            history: this.historyCommand.bind(this),
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Only autofocus if the URL hash is #terminal (user explicitly navigated)
        // or if the terminal is visible in the current viewport.
        const shouldAutoFocus = window.location.hash === '#terminal' || this.isElementInViewport(this.container);
        if (shouldAutoFocus) {
            this.input.focus();
        }
        
        // Show welcome message
        this.showWelcome();

        // Focus input when clicking anywhere in terminal
        this.container.addEventListener('click', () => {
            this.input.focus();
        });

        // Handle quick command chips
        const chips = document.querySelectorAll('.terminal-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const command = chip.dataset.command;
                this.input.value = command;
                this.executeCommand(command);
            });
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }

    executeCommand(input) {
        const [command, ...args] = input.split(' ');
        
        // Show command in output
        const promptPath = this.currentPath === '~' ? '~' : `~/${this.currentPath}`;
        this.addLine(`<span class="terminal-prompt">guest@jd-portfolio:${promptPath}$</span> <span class="terminal-command">${input}</span>`);

        if (this.commands[command.toLowerCase()]) {
            this.commands[command.toLowerCase()](args);
        } else if (command) {
            this.addLine(`<span class="terminal-text error">bash: ${command}: command not found</span>`);
            this.addLine(`<span class="terminal-text">Type 'help' for available commands.</span>`);
        }

        this.scrollToBottom();
    }

    autocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;

        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addLine(`<span class="terminal-text info">${matches.join('  ')}</span>`);
        }
    }

    // Check if an element is currently visible in the viewport
    isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Dynamic content extractors
    extractAboutContent() {
        const aboutSection = document.querySelector('#about .about-text');
        if (!aboutSection) return 'About section not found.';
        
        const name = aboutSection.querySelector('h3')?.textContent.trim() || 'Jan Dale Zarate';
        const paragraphs = Array.from(aboutSection.querySelectorAll('p'))
            .map(p => p.textContent.trim())
            .filter(text => text.length > 0);
        
        let lines = [];
        lines.push('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        lines.push(`<span class="terminal-text success">${name}</span>`);
        lines.push('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        lines.push('');
        
        paragraphs.forEach(para => {
            const textLines = para.match(/.{1,60}(\s|$)/g) || [para];
            textLines.forEach(line => {
                lines.push(`<span class="terminal-text">${line.trim()}</span>`);
            });
            lines.push('');
        });
        
        return lines;
    }

    extractSkillsContent() {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection) return ['Skills section not found.'];
        
        let lines = [];
        lines.push('<span class="terminal-text success">Technical Skills:</span>');
        lines.push('');
        
        const categories = skillsSection.querySelectorAll('.skill-category');
        categories.forEach(category => {
            const title = category.querySelector('h3')?.textContent.trim() || '';
            const skills = Array.from(category.querySelectorAll('.skill-item span'))
                .map(s => s.textContent.trim());
            
            if (title && skills.length > 0) {
                lines.push(`<span class="terminal-text warning">${title}</span>`);
                skills.forEach(skill => {
                    lines.push(`<span class="terminal-text">   • ${skill}</span>`);
                });
                lines.push('');
            }
        });
        
        lines.push('<span class="terminal-text info">Navigate to #skills section for detailed proficiency levels</span>');
        return lines;
    }

    extractProjectsContent() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return ['Projects section not found.'];
        
        let lines = [];
        lines.push('<span class="terminal-text success">Featured Projects:</span>');
        lines.push('');
        
        const projectCards = projectsSection.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const title = card.querySelector('.project-title')?.textContent.trim() || `Project ${index + 1}`;
            const description = card.querySelector('.project-description')?.textContent.trim() || '';
            const tags = Array.from(card.querySelectorAll('.project-tag'))
                .map(tag => tag.textContent.trim());
            
            lines.push(`<span class="terminal-text warning">${index + 1}. ${title}</span>`);
            if (description) {
                const descLines = description.match(/.{1,60}(\s|$)/g) || [description];
                descLines.forEach(line => {
                    lines.push(`<span class="terminal-text">   ${line.trim()}</span>`);
                });
            }
            if (tags.length > 0) {
                lines.push(`<span class="terminal-text">   Tech: ${tags.join(', ')}</span>`);
            }
            lines.push('');
        });
        
        lines.push('<span class="terminal-text info">Scroll to #projects section to see all project details</span>');
        return lines;
    }

    extractContactContent() {
        const contactSection = document.querySelector('#contact');
        if (!contactSection) return ['Contact section not found.'];
        
        let lines = [];
        lines.push('<span class="terminal-text success">Contact Information:</span>');
        lines.push('');
        
        const contactItems = contactSection.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const icon = item.querySelector('i')?.className || '';
            const title = item.querySelector('h3')?.textContent.trim() || '';
            const text = item.querySelector('p, a')?.textContent.trim() || '';
            
            if (title && text) {
                const emoji = icon.includes('envelope') ? '📧' : 
                             icon.includes('phone') ? '📱' : 
                             icon.includes('location') ? '📍' : '•';
                lines.push(`<span class="terminal-text">${emoji} ${title}: ${text}</span>`);
            }
        });
        
        // Add social links
        const socialLinks = document.querySelectorAll('.social-links a');
        if (socialLinks.length > 0) {
            lines.push('');
            lines.push('<span class="terminal-text">Social Links:</span>');
            socialLinks.forEach(link => {
                const icon = link.querySelector('i')?.className || '';
                const platform = icon.includes('github') ? '🐙 GitHub' :
                                icon.includes('linkedin') ? '💼 LinkedIn' :
                                icon.includes('facebook') ? '📘 Facebook' :
                                icon.includes('twitter') ? '🐦 Twitter' :
                                icon.includes('instagram') ? '📸 Instagram' : '🔗 Link';
                lines.push(`<span class="terminal-text">  ${platform}: ${link.href}</span>`);
            });
        }
        
        lines.push('');
        lines.push('<span class="terminal-text info">Type \'email\' to send me an email</span>');
        lines.push('<span class="terminal-text info">Navigate to #contact section to use contact form</span>');
        return lines;
    }

    showWelcome() {
        const ascii = `
     ___  ____     ____             __  ____      ___      
    |_  ||  _  \\  |  _ \\           |  ||  __| __ |_  |     
      | ||  |  |  | |_) |  ___   _ |  ||  _| |  | | | |    
  _ _ | ||  |  |  |  __/  | _ | |  |  ||  _  |  | | | |    
 |_|_|||_||____/  |_|     |___| |_____|_| |_||__| |_|_|    
        `;
        
        this.addLine(`<span class="terminal-welcome ascii-art">${ascii}</span>`);
        this.addLine(`<span class="terminal-welcome">Welcome to Jan Dale's Interactive Portfolio Terminal!</span>`);
        this.addLine(`<span class="terminal-text info">Type 'help' to see available commands, or 'ls' to list sections.</span>`);
        this.addLine('');
    }

    helpCommand() {
        this.addLine('<span class="terminal-help-title">Available Commands:</span>');
        this.addLine('<div class="terminal-command-list">');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">Navigation</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">ls</span><span class="terminal-command-desc">List available sections</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">cd &lt;section&gt;</span><span class="terminal-command-desc">Navigate to a section (home, about, skills, projects, contact)</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">pwd</span><span class="terminal-command-desc">Print current location</span></div>');
        this.addLine('');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">Information</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">cat &lt;section&gt;</span><span class="terminal-command-desc">Display section content (about, skills, projects, contact)</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">about</span><span class="terminal-command-desc">Learn about me (alias for \'cat about\')</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">skills</span><span class="terminal-command-desc">View technical skills (alias for \'cat skills\')</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">projects</span><span class="terminal-command-desc">See projects (alias for \'cat projects\')</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">contact</span><span class="terminal-command-desc">Get contact info (alias for \'cat contact\')</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">srv</span><span class="terminal-command-desc">Learn about SRV startup</span></div>');
        this.addLine('');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">Utility</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">clear</span><span class="terminal-command-desc">Clear the terminal screen</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">help</span><span class="terminal-command-desc">Show this help message</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">whoami</span><span class="terminal-command-desc">Display current user</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">date</span><span class="terminal-command-desc">Show current date and time</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">echo &lt;text&gt;</span><span class="terminal-command-desc">Print a message</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">history</span><span class="terminal-command-desc">Show command history</span></div>');
        this.addLine('');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">Quick Actions</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">social</span><span class="terminal-command-desc">View social media links</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">cv/resume</span><span class="terminal-command-desc">Download CV</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">email</span><span class="terminal-command-desc">Send me an email</span></div>');
        this.addLine('</div>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Examples:</span>');
        this.addLine('<span class="terminal-text">  cd about       - Navigate to about section</span>');
        this.addLine('<span class="terminal-text">  cat skills     - Display skills content</span>');
        this.addLine('<span class="terminal-text">  cd romantic.html - Navigate to romantic page</span>');
    }

    // ls command - list sections
    lsCommand() {
        this.addLine('<span class="terminal-text">Available sections:</span>');
        this.addLine('<span class="terminal-text">  home/          - Hero/Landing section</span>');
        this.addLine('<span class="terminal-text">  about/         - About me</span>');
        this.addLine('<span class="terminal-text">  terminal/      - Interactive terminal</span>');
        this.addLine('<span class="terminal-text">  skills/        - Technical skills</span>');
        this.addLine('<span class="terminal-text">  github-stats/  - Live GitHub statistics</span>');
        this.addLine('<span class="terminal-text">  projects/      - My projects</span>');
        this.addLine('<span class="terminal-text">  srv/           - SRV startup info</span>');
        this.addLine('<span class="terminal-text">  contact/       - Contact information</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">Files:</span>');
        this.addLine('<span class="terminal-text">  romantic.html  - Special romantic page</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Use \'cd &lt;section&gt;\' to navigate or \'cat &lt;section&gt;\' to view content.</span>');
    }

    // pwd command - print working directory
    pwdCommand() {
        const path = this.currentPath === '~' ? '/portfolio' : `/portfolio/${this.currentPath}`;
        this.addLine(`<span class="terminal-text">${path}</span>`);
    }

    // cd command - change directory/navigate
    cdCommand(args) {
        if (args.length === 0 || args[0] === '~') {
            this.currentPath = '~';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.addLine('<span class="terminal-text success">Navigated to home</span>');
            return;
        }
        
        const target = args[0].toLowerCase().replace('.html', '').replace('/', '');
        
        // Check for page navigation
        if (target === 'romantic') {
            this.addLine('<span class="terminal-text success">Navigating to romantic.html...</span>');
            setTimeout(() => {
                window.location.href = 'romantic.html';
            }, 500);
            return;
        }
        
        // Check for section navigation
        const section = document.getElementById(target);
        if (section) {
            this.currentPath = target;
            section.scrollIntoView({ behavior: 'smooth' });
            this.addLine(`<span class="terminal-text success">Navigated to ${target} section</span>`);
        } else {
            this.addLine(`<span class="terminal-text error">cd: ${args[0]}: No such section or page</span>`);
            this.addLine(`<span class="terminal-text">Try 'ls' to see available sections</span>`);
        }
    }

    // cat command - display content
    catCommand(args) {
        if (args.length === 0) {
            this.addLine('<span class="terminal-text">Usage: cat &lt;section&gt;</span>');
            this.addLine('<span class="terminal-text">Available: about, skills, projects, contact</span>');
            return;
        }
        
        const section = args[0].toLowerCase();
        let lines = [];
        
        switch(section) {
            case 'about':
                lines = this.extractAboutContent();
                break;
            case 'skills':
                lines = this.extractSkillsContent();
                break;
            case 'projects':
                lines = this.extractProjectsContent();
                break;
            case 'contact':
                lines = this.extractContactContent();
                break;
            default:
                this.addLine(`<span class="terminal-text error">cat: ${section}: No such section</span>`);
                this.addLine(`<span class="terminal-text">Available: about, skills, projects, contact</span>`);
                return;
        }
        
        // Add each line to the terminal
        lines.forEach(line => {
            this.addLine(line);
        });
    }

    // Alias commands that use dynamic content
    aboutCommand() {
        this.catCommand(['about']);
    }

    skillsCommand() {
        this.catCommand(['skills']);
    }

    projectsCommand() {
        this.catCommand(['projects']);
    }

    contactCommand() {
        this.catCommand(['contact']);
    }

    srvCommand() {
        this.addLine('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        this.addLine('<span class="terminal-text success">SRV: Serbisyo, Rito, Valid</span>');
        this.addLine('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">🚀 A blockchain-powered local service marketplace</span>');
        this.addLine('<span class="terminal-text">📍 Connecting Baguio City\'s service ecosystem</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text warning">Key Features:</span>');
        this.addLine('<span class="terminal-text">• Service discovery & provider profiles</span>');
        this.addLine('<span class="terminal-text">• Smart contract-based trust system</span>');
        this.addLine('<span class="terminal-text">• Vouching mechanism with staking</span>');
        this.addLine('<span class="terminal-text">• Real-time booking & scheduling</span>');
        this.addLine('<span class="terminal-text">• Secure crypto payments</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text warning">Service Categories:</span>');
        this.addLine('<span class="terminal-text">Home Repairs • Auto Services • Tech Support</span>');
        this.addLine('<span class="terminal-text">Cleaning • Beauty • Delivery • Tutoring</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Type \'cd srv\' to navigate to the full SRV section</span>');
    }

    socialCommand() {
        this.addLine('<span class="terminal-text success">Social Media Links:</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">🐙 GitHub: <span class="terminal-link" onclick="window.open(\'https://github.com/jadolation\', \'_blank\')">https://github.com/jadolation</span></span>');
        this.addLine('<span class="terminal-text">💼 LinkedIn: <span class="terminal-link" onclick="window.open(\'https://www.linkedin.com/in/jan-dale-zarate-1bbb67188/\', \'_blank\')">linkedin.com/in/jan-dale-zarate</span></span>');
        this.addLine('<span class="terminal-text">📘 Facebook: <span class="terminal-link" onclick="window.open(\'https://www.facebook.com/jandale.ii/\', \'_blank\')">facebook.com/jandale.ii</span></span>');
        this.addLine('<span class="terminal-text">📸 Instagram: <span class="terminal-link" onclick="window.open(\'https://www.instagram.com/jadolation/\', \'_blank\')">@jadolation</span></span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Click any link to open in a new tab</span>');
    }

    cvCommand() {
        this.addLine('<span class="terminal-text success">Opening CV...</span>');
        setTimeout(() => {
            window.open('assets/documents/Jan Dale Zarate - CV.pdf', '_blank');
            this.addLine('<span class="terminal-text info">CV opened in a new tab</span>');
            this.scrollToBottom();
        }, 500);
    }

    emailCommand() {
        this.addLine('<span class="terminal-text success">Opening email client...</span>');
        setTimeout(() => {
            window.location.href = 'mailto:zaratejandale15@gmail.com';
            this.addLine('<span class="terminal-text info">Email client opened</span>');
            this.scrollToBottom();
        }, 500);
    }

    githubCommand() {
        this.addLine('<span class="terminal-text success">Opening GitHub profile...</span>');
        setTimeout(() => {
            window.open('https://github.com/jadolation', '_blank');
            this.addLine('<span class="terminal-text info">GitHub profile opened in a new tab</span>');
            this.scrollToBottom();
        }, 500);
    }

    linkedinCommand() {
        this.addLine('<span class="terminal-text success">Opening LinkedIn profile...</span>');
        setTimeout(() => {
            window.open('https://www.linkedin.com/in/jan-dale-zarate-1bbb67188/', '_blank');
            this.addLine('<span class="terminal-text info">LinkedIn profile opened in a new tab</span>');
            this.scrollToBottom();
        }, 500);
    }

    whoamiCommand() {
        this.addLine('<span class="terminal-text">guest</span>');
        this.addLine('<span class="terminal-text info">You\'re viewing Jan Dale\'s portfolio as a guest</span>');
    }

    dateCommand() {
        const now = new Date();
        this.addLine(`<span class="terminal-text">${now.toString()}</span>`);
    }

    echoCommand(args) {
        this.addLine(`<span class="terminal-text">${args.join(' ')}</span>`);
    }

    historyCommand() {
        if (this.commandHistory.length === 0) {
            this.addLine('<span class="terminal-text">No commands in history</span>');
            return;
        }
        
        this.addLine('<span class="terminal-text">Command History:</span>');
        this.commandHistory.forEach((cmd, i) => {
            this.addLine(`<span class="terminal-text">  ${i + 1}  ${cmd}</span>`);
        });
    }

    sudoCommand(args) {
        const command = args.join(' ');
        if (command === 'rm -rf /' || command === 'rm -rf /*') {
            this.addLine('<span class="terminal-text error">Nice try! 😄</span>');
            this.addLine('<span class="terminal-text">This portfolio is protected by plot armor!</span>');
        } else {
            this.addLine('<span class="terminal-text warning">[sudo] password for guest:</span>');
            setTimeout(() => {
                this.addLine('<span class="terminal-text error">Sorry, you don\'t have sudo privileges here!</span>');
                this.addLine('<span class="terminal-text">But feel free to explore using available commands 😊</span>');
                this.scrollToBottom();
            }, 1000);
        }
    }

    clearCommand() {
        this.output.innerHTML = '';
        this.showWelcome();
    }

    addLine(html) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = html;
        this.output.appendChild(line);
    }

    scrollToBottom() {
        this.container.querySelector('.terminal-body').scrollTop = 
            this.container.querySelector('.terminal-body').scrollHeight;
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('interactiveTerminal')) {
        new InteractiveTerminal('interactiveTerminal');
    }
});
