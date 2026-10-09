# Manual projects (link-only entries) + overrides

Projects that don't live in your GitHub account (client work, collaborations,
anything link-only) are listed in `projects-manual.json`. They render as panels
in the Projects section, sorted by `order` ahead of auto-synced repos by default.

This file is hand-maintained. The hourly workflow only writes
`projects.json` / `main-page/projects.json` and never touches this folder.

## Manual entry format

```json
{
  "slug": "client-website",
  "name": "Client Website",
  "description": "One-line description of the work.",
  "language": "JavaScript",
  "logo": "assets/project-logos/manual/client-website.svg",
  "logoPlate": "light",
  "website": "https://example.com",
  "ownership": "Client project",
  "status": "Live",
  "role": "Design and build",
  "stack": "HTML, CSS, JavaScript",
  "facts": [{ "label": "Client", "value": "Example Org" }],
  "order": 50,
  "previewMode": "live"
}
```

- `slug`, `name` + `website` or `repoUrl` — required (entry is skipped otherwise).
- `description`, `language`, `ownership`, `status`, `role`, `stack`, `facts` —
  optional; omitted rows simply don't render.
- `logo`, `logoPlate` — optional; logos live in `assets/project-logos/manual/`.
  Without a logo the panel shows the GitHub mark.
- `order` — ascending sort key (default 50; SRV is pinned at 1).
- `previewMode` — `"live"` mounts the website in a sandboxed iframe preview
  when the tab opens (only if the entry has a `website`); anything else (or
  absent) keeps the logo/image panel. Only set `"live"` for sites verified to
  allow framing (no `X-Frame-Options` / `frame-ancestors` refusal).
- `allowSameOrigin: true` — opt-in escape hatch for framed sites whose own
  JS/CSS fail under the default opaque-origin sandbox (e.g. CORS-blocked
  subresources). Restores the framed origin without granting access to this
  page — safe only because our pages and framed sites are cross-origin;
  never set it for same-origin URLs. Default off.
- `placeholder: true` — renders only with `?placeholders=1` in the URL.
- No `stars`/`forks`: their absence is what marks an entry as link-only.

## Overrides (keyed by exact synced repo name)

Merged onto hourly-synced repos: `displayName`, `description`, `website`,
`ownership`, `status`, `role`, `stack`, `language`, `facts` (appended),
`logo`, `logoPlate`, `previewMode`, `order`, `hidden` (`true` removes a repo).

- An entry whose `url` duplicates an auto-synced repo URL is skipped.
