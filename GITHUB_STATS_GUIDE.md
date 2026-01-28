# GitHub Stats Integration Guide

## Overview
Real-time GitHub statistics displayed on your portfolio using the GitHub public API. No backend required, perfect for GitHub Pages!

## Features

### 📊 Live Statistics
- **Public Repositories**: Total count of your public repos
- **Followers**: Your GitHub follower count
- **Total Stars**: Combined stars across all repos
- **Active Repositories**: Count of repos you're actively maintaining

### 📈 Recent Activity
- Last 5 public events from your GitHub profile
- Shows: pushes, repo creation, stars, forks, issues, PRs
- Includes commit messages and timestamps
- Clickable links to repositories

### 💻 Top Languages
- Visual bar chart of your most-used languages
- Calculated from all public repositories
- Shows top 5 languages with percentages

## How It Works

### 1. API Calls
```javascript
// Fetches data from GitHub's public API
GET https://api.github.com/users/jadolation
GET https://api.github.com/users/jadolation/repos
GET https://api.github.com/users/jadolation/events/public
```

### 2. Caching
- Data cached in browser's `localStorage` for 5 minutes
- Reduces API calls and improves performance
- Works offline after first visit

### 3. Rate Limiting
- **Unauthenticated**: 60 requests/hour per IP
- **With Token**: 5000 requests/hour (requires backend)
- Current implementation: Unauthenticated (perfect for static sites)

## Customization

### Change Username
Edit `github-stats.js`:
```javascript
const githubUsername = 'YOUR_USERNAME_HERE'; // Line 269
```

### Adjust Cache Duration
```javascript
this.cacheExpiry = 5 * 60 * 1000; // 5 minutes (Line 9)
// Change to:
this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
```

### Modify Display
Edit `github-stats.css` to change colors, sizing, animations.

## Security

✅ **Secure** - No API tokens exposed  
✅ **Public Data Only** - Can't access private repos  
✅ **Rate Limited** - Prevents abuse  
✅ **Cached** - Reduces API calls  
✅ **Error Handling** - Graceful degradation  

See `GITHUB_API_SECURITY.md` for detailed security analysis.

## Troubleshooting

### "Rate limit exceeded" error
**Cause**: Too many requests from your IP  
**Solution**: Wait for rate limit reset (shown in error message) or data will load from cache

### Stats not updating
**Cause**: Using cached data  
**Solution**: Clear browser cache or wait 5 minutes for automatic refresh
```javascript
// In browser console:
localStorage.removeItem('github_stats_cache');
location.reload();
```

### No data showing
**Cause**: JavaScript errors or API issues  
**Solution**: 
1. Check browser console for errors
2. Verify username is correct
3. Check GitHub API status: https://www.githubstatus.com/

### CORS errors
**Cause**: GitHub API blocks request  
**Solution**: This shouldn't happen (GitHub API supports CORS), but if it does:
- Check if you're running from `file://` protocol (use local server)
- Verify internet connection
- Check GitHub API status

## Performance

### First Load
- ~500-1000ms to fetch all data
- Shows loading spinners during fetch
- Progressive enhancement (shows data as it loads)

### Subsequent Visits (within 5 min)
- Instant (<50ms)
- Loads from localStorage cache
- Background refresh for fresh data

### Optimization Tips
1. **Increase cache time** if your stats don't change often
2. **Lazy load** the section (only fetch when scrolled into view)
3. **Use GitHub Actions** to pre-generate stats (eliminates client-side fetching)

## Advanced: GitHub Actions Alternative

For **zero client-side API calls** and **no rate limits**:

1. Create `.github/workflows/update-stats.yml`:
```yaml
name: Update Stats
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Fetch stats
        run: |
          curl https://api.github.com/users/jadolation > data/github-stats.json
      - name: Commit
        run: |
          git config user.name "GitHub Actions"
          git add data/github-stats.json
          git commit -m "Update stats" || exit 0
          git push
```

2. Modify `github-stats.js` to fetch from `data/github-stats.json` instead of API

**Benefits**: No rate limits, faster load times, works offline  
**Drawback**: Stats update every 6 hours instead of real-time

## Testing

### Local Testing
```bash
# Start local server (required for CORS)
python3 -m http.server 8000
# Or
npx http-server

# Open browser
open http://localhost:8000
```

### Check Cache
```javascript
// Browser console
console.log(JSON.parse(localStorage.getItem('github_stats_cache')));
```

### Test Rate Limit
```javascript
// Browser console - check remaining requests
fetch('https://api.github.com/rate_limit')
  .then(r => r.json())
  .then(d => console.log(d.rate));
```

## Browser Support

✅ Chrome 80+  
✅ Firefox 75+  
✅ Safari 13+  
✅ Edge 80+  

**Required APIs**:
- `fetch()` - For API calls
- `localStorage` - For caching
- `Promise` - For async operations

## Dependencies

**None!** Pure vanilla JavaScript.

**External Services**:
- GitHub REST API v3
- Font Awesome (for icons - already in your project)

## Files

```
github-stats.js       - Main logic (data fetching, caching, display)
github-stats.css      - Styles (cards, animations, responsive)
GITHUB_API_SECURITY.md - Security documentation
GITHUB_STATS_GUIDE.md  - This file
```

## License

Part of your portfolio project. Feel free to customize and use in your own projects!

## Credits

Built with:
- GitHub REST API: https://docs.github.com/en/rest
- Vanilla JavaScript (no frameworks)
- CSS Grid & Flexbox
- localStorage API
