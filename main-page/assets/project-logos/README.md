# Project logos (Featured Projects cards)

Manual logo overrides live in this folder. A file here always beats an
auto-detected logo and is never deleted by the sync workflow.

## Naming

File name = repo `name` from `projects.json`, case-sensitive, no owner:

- `SRV.png` → card for `"name": "SRV"`
- `JDPersonalWebsite.png` → card for `"name": "JDPersonalWebsite"`

## Formats and limits

`svg`, `png`, `webp`, `jpg` (and `jpeg`). Max 300 KB per file.
Prefer SVG for marks, PNG for illustrated logos.

## Plates

Logos render centered on a flat light plate (`var(--text)`) via
`<img class="project-logo">` — never inlined into the DOM. If a logo is
only readable on dark, add `overrides.json` next to this file:

```json
{ "SRV": { "plate": "dark" } }
```

Valid plates: `"light"` (default), `"dark"` (`var(--space)`).

## Auto-detected logos

`auto/` holds workflow-vendored logos. Do not add files there by hand;
the workflow prunes files for repos that are no longer pinned.
