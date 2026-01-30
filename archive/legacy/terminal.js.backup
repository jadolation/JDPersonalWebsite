// Interactive Terminal
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
            whoami: this.whoamiCommand.bind(this),
            date: this.dateCommand.bind(this),
            echo: this.echoCommand.bind(this),
            sudo: this.sudoCommand.bind(this),
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.input.focus();
        
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
        this.addLine(`<span class="terminal-prompt">guest@jd-portfolio:${this.currentPath}$</span> <span class="terminal-command">${input}</span>`);

        if (this.commands[command.toLowerCase()]) {
            this.commands[command.toLowerCase()](args);
        } else if (command) {
            this.addLine(`<span class="terminal-text error">Command not found: ${command}</span>`);
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
        this.addLine(`<span class="terminal-text info">Type 'help' to see available commands, or use the quick commands below.</span>`);
        this.addLine('');
    }

    helpCommand() {
        this.addLine('<span class="terminal-help-title">Available Commands:</span>');
        this.addLine('<div class="terminal-command-list">');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">help</span><span class="terminal-command-desc">Show this help message</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">about</span><span class="terminal-command-desc">Learn about me</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">skills</span><span class="terminal-command-desc">View my technical skills</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">projects</span><span class="terminal-command-desc">See my projects</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">srv</span><span class="terminal-command-desc">Learn about SRV startup</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">contact</span><span class="terminal-command-desc">Get my contact information</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">social</span><span class="terminal-command-desc">View my social media links</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">cv/resume</span><span class="terminal-command-desc">Download my CV</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">email</span><span class="terminal-command-desc">Send me an email</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">whoami</span><span class="terminal-command-desc">Display current user</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">ls</span><span class="terminal-command-desc">List sections</span></div>');
        this.addLine('  <div class="terminal-command-item"><span class="terminal-command-name">clear</span><span class="terminal-command-desc">Clear the terminal</span></div>');
        this.addLine('</div>');
    }

    aboutCommand() {
        this.addLine('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        this.addLine('<span class="terminal-text success">About Jan Dale D. Zarate</span>');
        this.addLine('<span class="terminal-text info">════════════════════════════════════════════════════════</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">👨‍💻 IT Student & Tech Enthusiast</span>');
        this.addLine('<span class="terminal-text">📍 Based in Baguio City, Philippines</span>');
        this.addLine('<span class="terminal-text">🎓 Pursuing Bachelor\'s in Information Technology</span>');
        this.addLine('<span class="terminal-text">💼 CEO & Founder of SRV Digital Solutions Co.</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">I\'m passionate about creating innovative solutions to real-world</span>');
        this.addLine('<span class="terminal-text">problems. Currently building SRV - a platform connecting clients</span>');
        this.addLine('<span class="terminal-text">with local freelance service providers in Baguio.</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Type \'skills\' to see my technical expertise</span>');
        this.addLine('<span class="terminal-text info">Type \'projects\' to view my work</span>');
        this.addLine('<span class="terminal-text info">Type \'srv\' to learn about my startup</span>');
    }

    skillsCommand() {
        this.addLine('<span class="terminal-text success">Technical Skills:</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">🎨 <span class="terminal-text warning">Frontend:</span></span>');
        this.addLine('<span class="terminal-text">   • HTML5, CSS3, JavaScript (ES6+)</span>');
        this.addLine('<span class="terminal-text">   • React.js, Vue.js</span>');
        this.addLine('<span class="terminal-text">   • Responsive Design, Bootstrap, Tailwind CSS</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">⚙️ <span class="terminal-text warning">Backend:</span></span>');
        this.addLine('<span class="terminal-text">   • Node.js, Express.js</span>');
        this.addLine('<span class="terminal-text">   • Python, Django</span>');
        this.addLine('<span class="terminal-text">   • RESTful APIs, GraphQL</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">🗄️ <span class="terminal-text warning">Database:</span></span>');
        this.addLine('<span class="terminal-text">   • MySQL, PostgreSQL</span>');
        this.addLine('<span class="terminal-text">   • MongoDB, Firebase</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">⛓️ <span class="terminal-text warning">Blockchain:</span></span>');
        this.addLine('<span class="terminal-text">   • Smart Contracts (Solidity, Move)</span>');
        this.addLine('<span class="terminal-text">   • Sui Network, Ethereum</span>');
        this.addLine('<span class="terminal-text">   • Web3.js, NFT Development</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">🛠️ <span class="terminal-text warning">Tools & Other:</span></span>');
        this.addLine('<span class="terminal-text">   • Git, GitHub, Docker</span>');
        this.addLine('<span class="terminal-text">   • VS Code, Figma</span>');
        this.addLine('<span class="terminal-text">   • Agile, Scrum</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Navigate to #skills section to see detailed proficiency levels</span>');
    }

    projectsCommand() {
        this.addLine('<span class="terminal-text success">Featured Projects:</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text warning">1. SRV - Serbisyo, Rito, Valid</span>');
        this.addLine('<span class="terminal-text">   A blockchain-powered marketplace for local services</span>');
        this.addLine('<span class="terminal-text">   Tech: React, Node.js, Sui Blockchain, Smart Contracts</span>');
        this.addLine('<span class="terminal-text">   Type \'srv\' for more details</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text warning">2. Portfolio Website (NFT Certificate)</span>');
        this.addLine('<span class="terminal-text">   Personal portfolio with blockchain certification</span>');
        this.addLine('<span class="terminal-text">   Tech: HTML, CSS, JavaScript, Sui Network</span>');
        this.addLine('<span class="terminal-text">   Status: <span class="terminal-text success">You\'re viewing it right now!</span></span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Scroll to #projects section to see all projects</span>');
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
        this.addLine('<span class="terminal-text info">Navigate to #srv section for complete information</span>');
    }

    contactCommand() {
        this.addLine('<span class="terminal-text success">Contact Information:</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text">📧 Email: zaratejandale15@gmail.com</span>');
        this.addLine('<span class="terminal-text">📍 Location: Baguio City, Benguet, Philippines</span>');
        this.addLine('<span class="terminal-text">💼 LinkedIn: /in/jan-dale-zarate-1bbb67188/</span>');
        this.addLine('<span class="terminal-text">🐙 GitHub: @jadolation</span>');
        this.addLine('');
        this.addLine('<span class="terminal-text info">Type \'social\' to see all social media links</span>');
        this.addLine('<span class="terminal-text info">Type \'email\' to send me an email</span>');
        this.addLine('<span class="terminal-text info">Navigate to #contact section to use contact form</span>');
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
        }, 500);
    }

    emailCommand() {
        this.addLine('<span class="terminal-text success">Opening email client...</span>');
        setTimeout(() => {
            window.location.href = 'mailto:zaratejandale15@gmail.com';
            this.addLine('<span class="terminal-text info">Email client opened</span>');
        }, 500);
    }

    githubCommand() {
        this.addLine('<span class="terminal-text success">Opening GitHub profile...</span>');
        setTimeout(() => {
            window.open('https://github.com/jadolation', '_blank');
            this.addLine('<span class="terminal-text info">GitHub profile opened in a new tab</span>');
        }, 500);
    }

    linkedinCommand() {
        this.addLine('<span class="terminal-text success">Opening LinkedIn profile...</span>');
        setTimeout(() => {
            window.open('https://www.linkedin.com/in/jan-dale-zarate-1bbb67188/', '_blank');
            this.addLine('<span class="terminal-text info">LinkedIn profile opened in a new tab</span>');
        }, 500);
    }

    lsCommand() {
        this.addLine('<span class="terminal-text">about/     skills/     projects/     srv/     contact/</span>');
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
