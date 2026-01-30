/* JD Personal Website - Rule-based Chat Widget 
 * - Self-contained: injects its own HTML + scoped CSS
 * - No external deps
 * - Avoids touching existing globals (single window.JDChatbot namespace)
 */

(function () {
  'use strict';

  if (window.JDChatbot && window.JDChatbot.__initialized) return;

  const NAMESPACE = (window.JDChatbot = window.JDChatbot || {});
  NAMESPACE.__initialized = true;

  /**
   * Tiny lifecycle helper: run after DOM is ready.
   */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /**
   * Normalize text for simple keyword matching.
   */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[\p{P}\p{S}]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Only allow URLs we explicitly expect.
  function isSafeHref(href) {
    if (!href) return false;
    if (href.startsWith('#')) return true;
    if (href.startsWith('/')) return true;
    if (href.startsWith('../')) return true;

    try {
      const u = new URL(href);
      const allowed = new Set([
        'github.com',
        'www.linkedin.com',
        'www.facebook.com',
  'www.instagram.com',
  'instagram.com',
        'srvpinoy.com',
        'suiscan.xyz'
      ]);
      return u.protocol === 'https:' && allowed.has(u.hostname);
    } catch {
      return false;
    }
  }

  function linkify(text) {
    // Convert plain URLs and a few known internal tokens into anchors.
    // Keep it conservative + safe.
    const raw = String(text || '');

    // Replace known internal section tokens to clickable anchors.
    const tokens = [
      ['#projects', '#projects'],
      ['#skills', '#skills'],
      ['#about', '#about'],
      ['#srv', '#srv'],
      ['#terminal', '#terminal'],
      ['#github-stats', '#github-stats'],
      ['#contact', '#contact']
    ];

    let out = escapeHtml(raw);
    for (const [k] of tokens) {
      const safeK = escapeHtml(k);
      out = out.replaceAll(safeK, `<a class="jd-chatbot__link" href="${k}">${safeK}</a>`);
    }

    // Linkify https URLs
    out = out.replace(/(https:\/\/[\w\-._~:/?#\[\]@!$&'()*+,;=%]+)/g, (m) => {
      return isSafeHref(m)
        ? `<a class="jd-chatbot__link" href="${m}" target="_blank" rel="noopener noreferrer">${escapeHtml(m)}</a>`
        : escapeHtml(m);
    });

    // Special-case: turn "Click here to view: /path/to/file.pdf" into a friendly link.
    out = out.replace(
      /(Click here to view:)\s*(\/(?:main-page|romantic-page)\/[\w\-./%]+(?:\.html|\.pdf))/gi,
      (_m, label, href) => {
        if (!isSafeHref(href)) return `${escapeHtml(label)} ${escapeHtml(href)}`;
        const isPdf = href.toLowerCase().endsWith('.pdf');
        const downloadAttr = isPdf ? ' download' : '';
        return `${escapeHtml(label)} <a class="jd-chatbot__link" href="${href}" target="_blank" rel="noopener noreferrer"${downloadAttr}>Open CV (PDF)</a>`;
      }
    );

    // Linkify some known site paths (root-relative)
    out = out.replace(/(\/(?:main-page|romantic-page)\/[\w\-./%]+(?:\.html|\.pdf))/g, (m) => {
      if (!isSafeHref(m)) return escapeHtml(m);
      const isPdf = m.toLowerCase().endsWith('.pdf');
      const downloadAttr = isPdf ? ' download' : '';
      return `<a class="jd-chatbot__link" href="${m}" target="_blank" rel="noopener noreferrer"${downloadAttr}>${escapeHtml(m)}</a>`;
    });

    return out;
  }

  function detectPageContext() {
    const p = (location.pathname || '').toLowerCase();
    if (p.includes('/romantic-page/')) return 'romantic';
    if (p.includes('/main-page/')) return 'main';
    return 'root';
  }

  /**
   * Simple rules/intent matching.
   */
  // Lightweight website-aware knowledge base (no backend).
  const SITE = {
    name: 'Jan Dale D. Zarate',
  aliases: ['jan', 'jan dale', 'jan dale zarate', 'jan dale d zarate', 'jan dale d. zarate', 'jd', 'jdz'],
    role: 'IT Student, Tech Enthusiast & CEO',
    age: 22,
    location: 'Baguio City, Benguet',
    email: 'zaratejandale15@gmail.com',
    github: 'https://github.com/jadolation',
    linkedin: 'https://www.linkedin.com/in/jan-dale-zarate-1bbb67188/',
    facebook: 'https://www.facebook.com/jandale.ii/',
    instagram: 'https://www.instagram.com/jadolation/',
    cv: '/main-page/assets/documents/Jan Dale Zarate - CV.pdf',
    srv: {
      name: 'SRV (Serbisyo, Rito, Valid)',
      url: 'https://srvpinoy.com/',
      summary:
        'A blockchain-powered marketplace connecting clients with local freelance service providers in Baguio City, featuring service discovery, provider profiles, booking, and a staking-based vouching system.'
    },
    romantic: {
      page: '/romantic-page/index.html',
      letters: '/romantic-page/love-letters.html',
      aboutHerAnchor: '/romantic-page/index.html#about-her',
      her: {
        name: 'Khryz Ryn C. Mauri',
        aliases: ['khryz', 'khryz ryn', 'khryz ryn mauri', 'khryz ryn c mauri', 'khryz ryn c. mauri', 'kr', 'baby kr'],
        instagram: 'https://www.instagram.com/maurii.kr/',
        about:
          "She's someone who makes every day better just by being herself—kind, thoughtful, curious, and with a smile that can brighten a tough day.\n\n" +
          "Things she loves (from the site): dogs (especially Bandit 🐾), anime/manga, crime & mystery, and late-night reviews."
      }
    }
  };

  // Fetch projects.json if available (best effort).
  let cachedProjects = null;
  async function loadProjects() {
    if (cachedProjects) return cachedProjects;

    // main page has projects.json at /main-page/projects.json.
    const candidates = ['/main-page/projects.json', '/projects.json'];
    for (const p of candidates) {
      try {
        const res = await fetch(p, { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data)) {
          cachedProjects = data;
          return cachedProjects;
        }
      } catch {
        // ignore
      }
    }
    cachedProjects = [];
    return cachedProjects;
  }

  function getBotReply(userText) {
    const ctx = detectPageContext();
    const t = normalize(userText);

    if (!t) {
      return "Send a message and I'll respond. Try: projects, skills, contact, github.";
    }

    const has = (...words) => words.some((w) => t.includes(w));

    // Name-based questions (Jan Dale)
    if (
      has('who is', 'who’s', 'whos', 'who') &&
      SITE.aliases.some((a) => t.includes(a))
    ) {
      const link = ctx === 'main' ? '#about' : '/main-page/index.html#about';
      return (
        `${SITE.name} — ${SITE.role}.\n` +
        `A ${SITE.age}-year-old BSIT student based in ${SITE.location}.\n\n` +
        `He’s also the CEO/founder of SRV Digital Solutions Co., co-leading SRV (Serbisyo, Rito, Valid), a web app connecting clients with local freelance service providers in Baguio.\n\n` +
        `About section: ${link}\n` +
        `CV: ${SITE.cv}\n` +
        `GitHub: ${SITE.github}`
      );
    }

    // Name-based questions (Khryz Ryn Mauri / KR)
    if (
      has('who is', 'who’s', 'whos', 'who') &&
      SITE.romantic.her.aliases.some((a) => t.includes(a))
    ) {
      return (
        `${SITE.romantic.her.name} 💕\n\n` +
        `${SITE.romantic.her.about}\n\n` +
        `About Her section: ${SITE.romantic.aboutHerAnchor}\n` +
        `Instagram: ${SITE.romantic.her.instagram}`
      );
    }

    if (has('hi', 'hello', 'hey', 'yo', 'kumusta', 'kamusta')) {
      return (
        `Hi! I'm ${SITE.name}'s portfolio bot.\n\n` +
        `Quick picks:\n` +
        `• About: #about\n` +
        `• Projects: #projects\n` +
        `• Skills: #skills\n` +
        `• GitHub activity: #github-stats\n` +
        `• Contact: #contact\n\n` +
        `You can also ask about SRV, resume/CV, or the romantic page.`
      );
    }

    if (has('help', 'commands', 'options')) {
      return (
        `Try any of these:\n` +
        `• "about" – who JD is\n` +
        `• "projects" – featured + GitHub-synced projects\n` +
        `• "skills" – tech stack\n` +
        `• "github" – profile + repos\n` +
        `• "srv" – startup summary\n` +
        `• "resume" – open CV PDF\n` +
        `• "contact" – email + social links\n` +
        `• "romantic" – romantic page links`
      );
    }

    if (has('about', 'who are you', 'who is', 'bio', 'background')) {
      const link = ctx === 'main' ? '#about' : '/main-page/index.html#about';
      return (
        `${SITE.name} — ${SITE.role}.\n` +
        `Based in ${SITE.location}. Age: ${SITE.age}.\n\n` +
        `More details: ${link}`
      );
    }

    if (has('project', 'projects', 'portfolio', 'work')) {
      const link = ctx === 'main' ? '#projects' : '/main-page/index.html#projects';
      return (
        `Projects are shown in the Featured Projects section (${link}).\n` +
        `That section is synced from GitHub regularly (CI/CD) so it stays updated.\n\n` +
        `If you want, type "top projects" to list the current repos from projects.json.`
      );
    }

    if (has('top projects', 'list projects', 'show projects', 'repos', 'repositories')) {
      // will be handled async by the UI layer
      return { type: 'projects_list' };
    }

    if (has('skill', 'skills', 'tech', 'stack', 'technology')) {
      const link = ctx === 'main' ? '#skills' : '/main-page/index.html#skills';
      return (
        `Skills & Technologies: ${link}\n\n` +
        `Highlights include Java, HTML, TypeScript, Git/GitHub, Docker, and React Native, plus UI design and blockchain fundamentals.`
      );
    }

    if (has('github', 'repo', 'repositories', 'code')) {
      const link = ctx === 'main' ? '#github-stats' : '/main-page/index.html#github-stats';
      return (
        `GitHub profile: ${SITE.github}\n` +
        `On-site GitHub stats: ${link}\n\n` +
        `Tip: the GitHub section shows activity, repos, and language stats.`
      );
    }

    if (has('linkedin')) {
  return `LinkedIn: ${SITE.linkedin}`;
    }

    if (has('facebook', 'fb')) {
  return `Facebook: ${SITE.facebook}`;
    }

    if (has('instagram', 'ig')) {
  return `Instagram: ${SITE.instagram}`;
    }

    if (has('contact', 'email', 'message', 'reach')) {
      const link = ctx === 'main' ? '#contact' : '/main-page/index.html#contact';
      return (
        `Contact section: ${link}\n` +
        `Email: ${SITE.email}\n\n` +
        `Socials:\n` +
        `• GitHub: ${SITE.github}\n` +
        `• LinkedIn: ${SITE.linkedin}\n` +
        `• Facebook: ${SITE.facebook}\n` +
        `• Instagram: ${SITE.instagram}`
      );
    }

    if (has('resume', 'cv')) {
      return (
        `📄 Here's my CV/Resume:\n\n` +
        `Click here to view: ${SITE.cv}\n\n` +
        `It will open in a new tab and you can download it too!`
      );
    }

    if (has('srv', 'startup', 'serbisyo', 'rito', 'valid')) {
      const link = ctx === 'main' ? '#srv' : '/main-page/index.html#srv';
      return (
        `${SITE.srv.name}\n` +
        `${SITE.srv.summary}\n\n` +
        `Read the SRV section: ${link}\n` +
        `Website: ${SITE.srv.url}`
      );
    }

    if (has('romantic', 'love', 'letters')) {
      return (
        `Romantic page: ${SITE.romantic.page}\n` +
        `Love Letters: ${SITE.romantic.letters}`
      );
    }

    if (has('thanks', 'thank you', 'salamat')) {
      return "You're welcome!";
    }

    // fallback
    return (
      `I didn't catch that.\n` +
      `Try: about, projects, top projects, skills, github, srv, resume, contact.`
    );
  }

  function createEl(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v);
      }
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else el.appendChild(c);
      }
    }
    return el;
  }

  function injectStyles() {
    if (document.getElementById('jd-chatbot-styles')) return;

    const style = createEl('style', { id: 'jd-chatbot-styles' });
    style.textContent = `
      :root {
        --jd-chat-bg: #0f172a;
        --jd-chat-panel: rgba(15, 23, 42, 0.92);
        --jd-chat-border: rgba(255,255,255,0.10);
        --jd-chat-text: #e5e7eb;
        --jd-chat-muted: rgba(229,231,235,0.75);
        --jd-chat-primary: #3b82f6;
        --jd-chat-bubble-user: #2563eb;
        --jd-chat-bubble-bot: rgba(255,255,255,0.09);
        --jd-chat-shadow: 0 18px 50px rgba(0,0,0,0.35);
      }

      .jd-chatbot {
        position: fixed;
        right: 100px;
        bottom: 30px;
        z-index: 9999;
        font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }

      .jd-chatbot__fab {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        border: 1px solid var(--jd-chat-border);
        background: linear-gradient(135deg, #00d4ff, #0099ff);
        color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-size: 1.6rem;
      }

      .jd-chatbot__fab:hover {
        transform: translateY(-5px) scale(1.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }

      .jd-chatbot__fab:active {
        transform: translateY(-3px) scale(1.05);
      }

      body.romantic-theme .jd-chatbot__fab {
        background: linear-gradient(135deg, #ff6b9d, #ff8fab);
        box-shadow: 0 4px 20px rgba(255, 107, 157, 0.4);
      }

      body.romantic-theme .jd-chatbot__fab:hover {
        box-shadow: 0 8px 25px rgba(255, 107, 157, 0.5);
      }

      .jd-chatbot__fab:focus {
        outline: 2px solid rgba(59,130,246,0.7);
        outline-offset: 2px;
      }

      /* Hide FAB when panel is open */
      .jd-chatbot__panel[data-open="true"] ~ .jd-chatbot__fab {
        display: none;
      }

      .jd-chatbot__panel {
        width: min(360px, calc(100vw - 32px));
        height: min(520px, calc(100vh - 110px));
        margin-bottom: 12px;
        border-radius: 16px;
        border: 1px solid var(--jd-chat-border);
        background: var(--jd-chat-panel);
        backdrop-filter: blur(10px);
        box-shadow: var(--jd-chat-shadow);
        overflow: hidden;
        display: none;
      }

      body.romantic-theme .jd-chatbot__panel {
        border: 2px solid rgba(255, 179, 217, 0.3);
        box-shadow: 0 8px 30px rgba(255, 107, 157, 0.2);
      }

      .jd-chatbot__panel[data-open="true"] {
        display: flex;
        flex-direction: column;
      }

      .jd-chatbot__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px;
        border-bottom: 1px solid var(--jd-chat-border);
      }

      .jd-chatbot__title {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--jd-chat-text);
        font-weight: 600;
        font-size: 14px;
      }

      .jd-chatbot__avatar {
        width: 28px;
        height: 28px;
        border-radius: 10px;
        background: rgba(255,255,255,0.10);
        display: grid;
        place-items: center;
        border: 1px solid var(--jd-chat-border);
        flex: 0 0 auto;
      }

      .jd-chatbot__subtitle {
        display: block;
        font-weight: 400;
        color: var(--jd-chat-muted);
        font-size: 12px;
        margin-top: 2px;
      }

      .jd-chatbot__close {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        border: 1px solid var(--jd-chat-border);
        background: rgba(255,255,255,0.07);
        color: var(--jd-chat-text);
        cursor: pointer;
      }

      .jd-chatbot__messages {
        padding: 12px;
        overflow: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

  .jd-chatbot__msg {
        max-width: 85%;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid var(--jd-chat-border);
        color: var(--jd-chat-text);
        font-size: 13px;
        line-height: 1.35;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .jd-chatbot__link {
        color: rgba(147, 197, 253, 1);
        text-decoration: underline;
      }

      .jd-chatbot__link:hover {
        color: rgba(191, 219, 254, 1);
      }

      .jd-chatbot__msg--bot {
        align-self: flex-start;
        background: var(--jd-chat-bubble-bot);
        border-top-left-radius: 10px;
      }

      .jd-chatbot__msg--user {
        align-self: flex-end;
        background: rgba(37,99,235,0.85);
        border-top-right-radius: 10px;
      }

      body.romantic-theme .jd-chatbot__msg--user {
        background: linear-gradient(135deg, #ff6b9d, #ff8fab);
      }

      .jd-chatbot__time {
        margin-top: 6px;
        font-size: 11px;
        color: var(--jd-chat-muted);
        opacity: 0.9;
      }

      .jd-chatbot__composer {
        padding: 10px;
        border-top: 1px solid var(--jd-chat-border);
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .jd-chatbot__input {
        flex: 1;
        height: 40px;
        border-radius: 12px;
        border: 1px solid var(--jd-chat-border);
        background: rgba(2,6,23,0.35);
        color: var(--jd-chat-text);
        padding: 0 12px;
        font-size: 13px;
      }

      .jd-chatbot__input::placeholder {
        color: rgba(229,231,235,0.55);
      }

      .jd-chatbot__send {
        width: 44px;
        height: 40px;
        border-radius: 12px;
        border: 1px solid var(--jd-chat-border);
        background: rgba(59,130,246,0.95);
        color: white;
        cursor: pointer;
      }

      body.romantic-theme .jd-chatbot__send {
        background: linear-gradient(135deg, #ff6b9d, #ff8fab);
      }

      body.romantic-theme .jd-chatbot__send:hover {
        background: linear-gradient(135deg, #ff5a8c, #ff789a);
      }

      .jd-chatbot__chiprow {
        padding: 0 12px 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .jd-chatbot__chip {
        font-size: 12px;
        color: var(--jd-chat-text);
        background: rgba(255,255,255,0.07);
        border: 1px solid var(--jd-chat-border);
        padding: 6px 10px;
        border-radius: 999px;
        cursor: pointer;
      }

      body.romantic-theme .jd-chatbot__chip {
        background: rgba(255, 107, 157, 0.15);
        border-color: rgba(255, 179, 217, 0.3);
      }

      body.romantic-theme .jd-chatbot__chip:hover {
        background: linear-gradient(135deg, #ff6b9d, #ff8fab);
      }

      @media (max-width: 768px) {
        .jd-chatbot { 
          right: 30px; 
          bottom: 100px;
        }
        .jd-chatbot__panel { 
          border-radius: 14px;
          right: 30px;
          bottom: 168px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function formatTime(d) {
    try {
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (_) {
      return '';
    }
  }

  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  function addMessage(container, who, text) {
    const msg = createEl('div', {
      class: `jd-chatbot__msg ${who === 'user' ? 'jd-chatbot__msg--user' : 'jd-chatbot__msg--bot'}`
    });

    // Render bot replies as linkified HTML; keep user content as plain text.
    if (who === 'bot') {
      msg.innerHTML = linkify(text);
    } else {
      msg.appendChild(document.createTextNode(text));
    }
    msg.appendChild(createEl('div', { class: 'jd-chatbot__time', text: formatTime(new Date()) }));

    container.appendChild(msg);
    scrollToBottom(container);
  }

  function addTyping(container) {
    const typing = createEl('div', {
      class: 'jd-chatbot__msg jd-chatbot__msg--bot',
      'data-typing': 'true'
    }, ['Typing…']);

    container.appendChild(typing);
    scrollToBottom(container);
    return typing;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildWidget() {
    injectStyles();

    const root = createEl('div', { class: 'jd-chatbot', id: 'jd-chatbot' });

    const panel = createEl('div', { class: 'jd-chatbot__panel', 'data-open': 'false', role: 'dialog', 'aria-label': 'Chatbot' });

    const header = createEl('div', { class: 'jd-chatbot__header' });

    const titleBlock = createEl('div', { class: 'jd-chatbot__title' });
    const avatar = createEl('div', { class: 'jd-chatbot__avatar', 'aria-hidden': 'true' }, [
      createEl('span', { text: '💬' })
    ]);

    const titleTextWrap = createEl('div');
    titleTextWrap.appendChild(createEl('div', { text: "JD's Chat" }));
    titleTextWrap.appendChild(createEl('span', { class: 'jd-chatbot__subtitle', text: 'Rule-based assistant' }));

    titleBlock.appendChild(avatar);
    titleBlock.appendChild(titleTextWrap);

    const closeBtn = createEl('button', { class: 'jd-chatbot__close', type: 'button', 'aria-label': 'Close chat', text: '×' });

    header.appendChild(titleBlock);
    header.appendChild(closeBtn);

    const messages = createEl('div', { class: 'jd-chatbot__messages', role: 'log', 'aria-live': 'polite' });

    const chipRow = createEl('div', { class: 'jd-chatbot__chiprow' });
    const chips = ['Projects', 'Skills', 'Contact', 'GitHub', 'Resume'];
    chips.forEach((label) => {
      chipRow.appendChild(createEl('button', { class: 'jd-chatbot__chip', type: 'button', text: label }));
    });

    const composer = createEl('div', { class: 'jd-chatbot__composer' });
    const input = createEl('input', {
      class: 'jd-chatbot__input',
      type: 'text',
      placeholder: 'Type a message…',
      'aria-label': 'Chat message'
    });
    const send = createEl('button', { class: 'jd-chatbot__send', type: 'button', 'aria-label': 'Send', text: '➤' });

    composer.appendChild(input);
    composer.appendChild(send);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(chipRow);
    panel.appendChild(composer);

    const fab = createEl('button', {
      class: 'jd-chatbot__fab',
      type: 'button',
      'aria-label': 'Open chat'
    }, [createEl('span', { text: '💬' })]);

    root.appendChild(panel);
    root.appendChild(fab);

    document.body.appendChild(root);

    function open() {
      panel.setAttribute('data-open', 'true');
      fab.setAttribute('aria-label', 'Chat is open');
      setTimeout(() => input.focus(), 0);
      if (!messages.hasChildNodes()) {
        addMessage(messages, 'bot', "Hi! I'm JD's portfolio bot. Ask about projects, skills, or contact.");
      }
    }

    function close() {
      panel.setAttribute('data-open', 'false');
      fab.setAttribute('aria-label', 'Open chat');
    }

    function toggle() {
      if (panel.getAttribute('data-open') === 'true') close();
      else open();
    }

    async function handleSend(text) {
      const trimmed = String(text || '').trim();
      if (!trimmed) return;

      addMessage(messages, 'user', trimmed);
      input.value = '';

      const typing = addTyping(messages);

      let reply;
      try {
        reply = getBotReply(trimmed);
        if (reply && typeof reply === 'object' && reply.type === 'projects_list') {
          const list = await loadProjects();
          if (!list.length) {
            reply = `I couldn't load projects.json right now.\nYou can still check: ${SITE.github}`;
          } else {
            const top = list.slice(0, 8);
            const lines = top.map((p) => {
              const lang = p.language ? ` (${p.language})` : '';
              const stars = typeof p.stars === 'number' ? ` ★${p.stars}` : '';
              const desc = p.description ? ` — ${p.description}` : '';
              return `• ${p.name}${lang}${stars}\n  ${p.url}${desc}`;
            });
            reply = `Here are the current repos synced to this site:\n\n${lines.join('\n\n')}\n\nFull profile: ${SITE.github}`;
          }
        }
      } catch (e) {
        reply = "Something went wrong generating a reply. Try again or type 'help'.";
      }

      // small delay to feel natural
      setTimeout(() => {
        removeTyping(typing);
        addMessage(messages, 'bot', String(reply));
      }, 450);
    }

    fab.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);

    send.addEventListener('click', () => handleSend(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend(input.value);
      }
      if (e.key === 'Escape') {
        close();
      }
    });

    chipRow.addEventListener('click', (e) => {
      const btn = e.target && e.target.closest && e.target.closest('button');
      if (!btn) return;
      handleSend(btn.textContent || '');
    });

    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + / to toggle
      const isToggle = (e.ctrlKey || e.metaKey) && e.key === '/';
      if (!isToggle) return;
      e.preventDefault();
      toggle();
    });

    // expose a tiny API for other scripts (e.g., terminal command) without coupling.
    NAMESPACE.open = open;
    NAMESPACE.close = close;
    NAMESPACE.toggle = toggle;
    NAMESPACE.send = handleSend;
  }

  onReady(buildWidget);
})();
