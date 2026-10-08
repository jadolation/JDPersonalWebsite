# Manual projects (link-only entries)

Projects that don't live in your GitHub account (client work, collaborations,
anything link-only) are listed here. They render FIRST in the Projects grid,
ahead of the auto-synced GitHub repos, using the same card design.

This file is hand-maintained. The hourly workflow only writes
`projects.json` / `main-page/projects.json` and never touches this folder.

## Entry format

```json
[
  {
    "name": "Client Website",
    "url": "https://example.com",
    "description": "One-line description of the work.",
    "language": "JavaScript",
    "logo": "assets/project-logos/client-website.svg?v=ab12cd34",
    "logoPlate": "light"
  }
]
```

- `name`, `url` — required. `url` can be any website (not just GitHub).
- `description`, `language` — optional; omitted lines simply don't render.
- `logo`, `logoPlate` — optional; same `project-logos/` overrides as auto repos.
  Without a logo the card shows the text fallback (no generated preview is
  attempted for non-GitHub URLs).
- No `stars`/`forks`: their absence is what marks an entry as link-only, so
  never add those fields here. The card overlay reads "Visit site" instead
  of "View on GitHub".
- An entry whose `url` duplicates an auto-synced repo URL is skipped.
