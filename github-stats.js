// GitHub Stats Component with Security Best Practices
// No API keys exposed, uses public GitHub API with rate limiting awareness

class GitHubStats {
    constructor(username) {
        this.username = username;
        this.apiBase = 'https://api.github.com';
        this.cache = this.loadCache();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
        this.rateLimitRemaining = null;
        this.rateLimitReset = null;
    }

    // Load cached data from localStorage
    loadCache() {
        try {
            const cached = localStorage.getItem('github_stats_cache');
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < this.cacheExpiry) {
                    console.log('Using cached GitHub data');
                    return data;
                }
            }
        } catch (e) {
            console.warn('Failed to load cache:', e);
        }
        return null;
    }

    // Save data to cache
    saveCache(data) {
        try {
            localStorage.setItem('github_stats_cache', JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save cache:', e);
        }
    }

    // Make API request with rate limit handling
    async fetchWithRateLimit(url) {
        try {
            const response = await fetch(url);
            
            // Check rate limit headers
            this.rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
            this.rateLimitReset = response.headers.get('X-RateLimit-Reset');

            // Show warning if rate limit is low
            if (this.rateLimitRemaining !== null && parseInt(this.rateLimitRemaining) < 10) {
                this.showRateLimitWarning();
            }

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Rate limit exceeded. Using cached data if available.');
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    // Fetch user profile data
    async fetchUserData() {
        if (this.cache?.userData) {
            return this.cache.userData;
        }

        const data = await this.fetchWithRateLimit(`${this.apiBase}/users/${this.username}`);
        return data;
    }

    // Fetch user repositories
    async fetchRepos() {
        if (this.cache?.repos) {
            return this.cache.repos;
        }

        // Fetch repos sorted by updated date, limit to 100
        const data = await this.fetchWithRateLimit(
            `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=100`
        );
        return data;
    }

    // Fetch recent activity (public events)
    async fetchActivity() {
        if (this.cache?.activity) {
            return this.cache.activity;
        }

        const data = await this.fetchWithRateLimit(
            `${this.apiBase}/users/${this.username}/events/public?per_page=10`
        );
        return data;
    }

    // Calculate total stars
    calculateTotalStars(repos) {
        return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
    }

    // Calculate language statistics from actual repo language data
    async calculateLanguageStats(repos) {
        const languageBytes = {};
        
        // Fetch language data for each repo (up to 20 repos to avoid rate limits)
        const reposToCheck = repos.slice(0, 20);
        
        for (const repo of reposToCheck) {
            try {
                // Use cached languages if available
                const cacheKey = `lang_${repo.full_name}`;
                let repoLanguages = this.cache?.[cacheKey];
                
                if (!repoLanguages) {
                    const response = await fetch(`${this.apiBase}/repos/${repo.full_name}/languages`);
                    if (response.ok) {
                        repoLanguages = await response.json();
                        // Cache individual repo languages
                        if (this.cache) {
                            this.cache[cacheKey] = repoLanguages;
                        }
                    }
                }
                
                if (repoLanguages) {
                    // Add bytes for each language
                    Object.entries(repoLanguages).forEach(([lang, bytes]) => {
                        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
                    });
                }
            } catch (error) {
                console.warn(`Failed to fetch languages for ${repo.full_name}:`, error);
            }
        }

        // Convert to percentage based on actual code bytes
        const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
        
        if (totalBytes === 0) {
            // Fallback to simple repo count if API calls fail
            return this.calculateLanguageStatsFallback(repos);
        }
        
        const languageStats = Object.entries(languageBytes)
            .map(([name, bytes]) => ({
                name,
                percentage: ((bytes / totalBytes) * 100).toFixed(1)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5); // Top 5 languages

        return languageStats;
    }

    // Fallback language calculation (counts repos per language)
    calculateLanguageStatsFallback(repos) {
        const languages = {};
        
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
        const languageStats = Object.entries(languages)
            .map(([name, count]) => ({
                name,
                percentage: ((count / total) * 100).toFixed(1)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);

        return languageStats;
    }

    // Format activity for display
    formatActivity(events) {
        return events.slice(0, 5).map(event => {
            let action = '';
            let message = '';

            switch (event.type) {
                case 'PushEvent':
                    action = 'Pushed';
                    const commits = event.payload.commits?.length || 0;
                    message = `${commits} commit${commits !== 1 ? 's' : ''}`;
                    if (event.payload.commits?.[0]?.message) {
                        message += `: ${event.payload.commits[0].message}`;
                    }
                    break;
                case 'CreateEvent':
                    action = 'Created';
                    message = event.payload.ref_type === 'repository' 
                        ? 'repository' 
                        : `${event.payload.ref_type} ${event.payload.ref}`;
                    break;
                case 'WatchEvent':
                    action = 'Starred';
                    break;
                case 'ForkEvent':
                    action = 'Forked';
                    break;
                case 'IssuesEvent':
                    action = event.payload.action === 'opened' ? 'Opened issue' : 'Updated issue';
                    message = event.payload.issue?.title || '';
                    break;
                case 'PullRequestEvent':
                    action = event.payload.action === 'opened' ? 'Opened PR' : 'Updated PR';
                    message = event.payload.pull_request?.title || '';
                    break;
                default:
                    action = event.type.replace('Event', '');
            }

            return {
                type: action,
                repo: event.repo.name,
                repoUrl: `https://github.com/${event.repo.name}`,
                message: message.length > 80 ? message.substring(0, 80) + '...' : message,
                time: this.timeAgo(new Date(event.created_at))
            };
        });
    }

    // Time ago helper
    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    }

    // Update DOM with stats
    async updateStatsDisplay(userData, repos, activity) {
        // Update stat cards
        document.getElementById('github-repos').textContent = userData.public_repos;
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-stars').textContent = this.calculateTotalStars(repos);
        document.getElementById('github-contributions').textContent = repos.length;

        // Remove loading class
        document.querySelectorAll('.stat-value').forEach(el => {
            el.classList.remove('loading');
        });

        // Update activity
        this.updateActivityDisplay(activity);

        // Update language stats (async - fetches additional data)
        await this.updateLanguageStats(repos);
    }

    // Update activity display
    updateActivityDisplay(events) {
        const activityList = document.getElementById('github-activity-list');
        if (!activityList) return;

        const formattedActivity = this.formatActivity(events);
        
        if (formattedActivity.length === 0) {
            activityList.innerHTML = `
                <li class="activity-item">
                    <span class="terminal-text">No recent public activity found.</span>
                </li>
            `;
            return;
        }
        
        activityList.innerHTML = formattedActivity.map(item => `
            <li class="activity-item">
                <div>
                    <a href="${item.repoUrl}" target="_blank" rel="noopener noreferrer" class="activity-repo">
                        <i class="fab fa-github"></i>
                        ${item.repo}
                    </a>
                    <span class="activity-type">${item.type}</span>
                </div>
                ${item.message ? `<div class="activity-message">${item.message}</div>` : ''}
                <div class="activity-time">${item.time}</div>
            </li>
        `).join('');
    }

    // Update language stats
    async updateLanguageStats(repos) {
        const languageContainer = document.getElementById('language-bars');
        if (!languageContainer) return;

        const languageStats = await this.calculateLanguageStats(repos);
        
        languageContainer.innerHTML = languageStats.map(lang => `
            <div class="language-bar">
                <div class="language-name">${lang.name}</div>
                <div class="language-bar-bg">
                    <div class="language-bar-fill" style="width: ${lang.percentage}%"></div>
                </div>
                <div class="language-percentage">${lang.percentage}%</div>
            </div>
        `).join('');
    }

    // Show rate limit warning
    showRateLimitWarning() {
        const warning = document.createElement('div');
        warning.className = 'rate-limit-warning';
        warning.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>Rate Limit Warning:</strong> 
                GitHub API rate limit is low. Data updates may be limited.
                ${this.rateLimitReset ? `Resets at ${new Date(parseInt(this.rateLimitReset) * 1000).toLocaleTimeString()}` : ''}
            </div>
        `;

        const container = document.querySelector('.github-stats .container');
        if (container) {
            container.insertBefore(warning, container.firstChild);
        }
    }

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <strong>Error loading GitHub stats:</strong> ${message}
                ${this.cache ? '<br><small>Displaying cached data from previous visit.</small>' : ''}
            </div>
        `;

        const container = document.querySelector('.github-stats .container');
        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }

    // Initialize and load all stats
    async init() {
        try {
            // If we have valid cache, use it immediately and update in background
            if (this.cache) {
                console.log('Displaying cached GitHub stats...');
                await this.updateStatsDisplay(
                    this.cache.userData,
                    this.cache.repos,
                    this.cache.activity
                );
            }

            // Fetch fresh data
            console.log('Fetching fresh GitHub stats...');
            const [userData, repos, activity] = await Promise.all([
                this.fetchUserData(),
                this.fetchRepos(),
                this.fetchActivity()
            ]);

            // Save to cache
            this.saveCache({ userData, repos, activity });

            // Update display
            await this.updateStatsDisplay(userData, repos, activity);

        } catch (error) {
            console.error('GitHub Stats Error:', error);
            
            // If we have cache, use it
            if (this.cache) {
                await this.updateStatsDisplay(
                    this.cache.userData,
                    this.cache.repos,
                    this.cache.activity
                );
            }
            
            this.showError(error.message);
        }
    }

    // Clear cache and reload data (useful for debugging)
    clearCache() {
        localStorage.removeItem('github_stats_cache');
        console.log('GitHub stats cache cleared');
        this.cache = null;
    }
}

// Initialize GitHub stats when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Replace 'jadolation' with your actual GitHub username
    const githubUsername = 'jadolation';
    
    if (document.querySelector('.github-stats')) {
        window.githubStats = new GitHubStats(githubUsername);
        window.githubStats.init();
    }
});
