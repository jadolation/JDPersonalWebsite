# Plan: Fix marketing section paths, placeholders, mobile layout, and dangling script

## Current state
- 6 PNG source files are present in `main-page/assets/marketing/`: `srv-launching.png`, `srv-CAR.png`, `srv-help-wanted.png`, `srv-we-want-you.png`, `517-cover.png`, `517-coming-soon.png`
- All placeholder WebP files were deleted from the working tree.
- `main-page/index.html` has partial hand-edits: some thumbnails point to `.png`, but `data-full` still points to missing `.webp` files.
- The SRV group's 4th slot is in an inconsistent state (button inside `marketing-item--placeholder` with wrong `aria-label`).
- `main-page/index.html` contains a dangling `<script src="js/deployed.js"></script>` tag (the deployed section was removed in commit `f88f30e`, and `deployed.js` does not exist).
- Mobile CSS is missing the cover-image width override and may leak horizontal scroll.

## Decisions

### 1. Image format and paths
Convert all 6 PNGs to WebP and use WebP for both thumbnails and lightbox full-size images. This matches the original spec and keeps thumbnail weight under 400 KB.

### 2. SRV image mapping
| Slot | Source PNG | Thumbnail WebP | Full-size WebP |
|---|---|---|---|
| 1 - launching | `srv-launching.png` | `srv-launching-540.webp` | `srv-launching-1080.webp` |
| 2 - call-for-providers | `srv-CAR.png` | `srv-call-for-providers-540.webp` | `srv-call-for-providers-1080.webp` |
| 3 - beta-tester | `srv-we-want-you.png` | `srv-beta-tester-540.webp` | `srv-beta-tester-1080.webp` |
| 4 - placeholder | none yet | keep as placeholder div | n/a |

`data-full` attributes must point to the same basename as the thumbnail, just the larger size variant.

### 3. Bakery image mapping
| Slot | Source PNG | Thumbnail WebP | Full-size WebP |
|---|---|---|---|
| cover | `517-cover.png` | `bakery-cover-960.webp` | `bakery-cover-1600.webp` |
| coming-soon | `517-coming-soon.png` | `bakery-coming-soon-540.webp` | `bakery-coming-soon-1080.webp` |

### 4. Mobile layout fixes
- Add `.marketing-item--wide { grid-auto-columns: 90%; }` inside the `@media (max-width: 600px)` block.
- Add `body { overflow-x: hidden; }` to prevent page-level horizontal scroll from the horizontal snap grids.
- Verify image sizing in horizontal scroll: if images don't fill cells, set `.marketing-item figure { height: 100%; }` and `.marketing-open { height: 100%; }`.

### 5. Deployed script tag
Remove the dangling `<script src="js/deployed.js"></script>` from `main-page/index.html` since the deployed section and its JS were removed.

## Implementation tasks

### Task 1: Convert PNGs to WebP
Run ImageMagick/Pillow to create thumbnails and full-size WebPs:

```bash
# SRV
cwebp -q 82 srv-launching.png -o srv-launching-540.webp --resize 540 675
cwebp -q 82 srv-launching.png -o srv-launching-1080.webp --resize 1080 1350

cwebp -q 82 srv-CAR.png -o srv-call-for-providers-540.webp --resize 540 675
cwebp -q 82 srv-CAR.png -o srv-call-for-providers-1080.webp --resize 1080 1350

cwebp -q 88 srv-we-want-you.png -o srv-beta-tester-540.webp --resize 540 675
cwebp -q 88 srv-we-want-you.png -o srv-beta-tester-1080.webp --resize 1080 1350

# Bakery
cwebp -q 82 517-cover.png -o bakery-cover-960.webp --resize 960 540
cwebp -q 82 517-cover.png -o bakery-cover-1600.webp --resize 1600 900

cwebp -q 82 517-coming-soon.png -o bakery-coming-soon-540.webp --resize 540 675
cwebp -q 82 517-coming-soon.png -o bakery-coming-soon-1080.webp --resize 1080 1350
```

If `cwebp` is unavailable, use Python/Pillow with `quality=82` (or `88` for beta-tester).

### Task 2: Fix `main-page/index.html`
1. Replace all thumbnail `src` attributes with the new `.webp` filenames.
2. Replace all `data-full` attributes with matching `.webp` filenames.
3. Fix the SRV 4th slot back to a proper placeholder div (remove the button, restore `marketing-placeholder`).
4. Remove `<script src="js/deployed.js"></script>`.
5. Ensure `marketing-item--placeholder` items have no `marketing-open` button.

### Task 3: Fix `main-page/css/styles.css`
1. Inside `@media (max-width: 600px)`, verify `.marketing-item--wide { grid-auto-columns: 90%; }` exists.
2. Add `overflow-x: hidden` to `body` (or a wrapper) to prevent page-level horizontal scroll from the horizontal snap grids.
3. Verify `.marketing-item img` sizing in horizontal scroll context. If images don't fill cells, set `.marketing-item figure { height: 100%; }` and `.marketing-open { height: 100%; }`.

### Task 4: Verify `main-page/js/marketing.js`
No changes needed — it already reads `data-full` dynamically and cycles within groups.

### Task 5: Clean up source PNGs
Either add the 6 original PNGs to `.gitignore` or remove them from the working tree. The WebP files are the committed assets.

## Validation
- [ ] All 5 SRV/Bakery thumbnails load at desktop, tablet, and mobile
- [ ] Lightbox opens with full-size WebP; Esc/backdrop/Close/arrows work per group
- [ ] No 404s in console for images or scripts
- [ ] Mobile: cover spans wider than posters; no page-level horizontal scroll
- [ ] Placeholder slot is non-clickable and shows "Image placeholder"
- [ ] Total thumbnail weight < 400 KB
- [ ] Single commit: `Fix marketing section paths, placeholders, mobile layout, and dangling script`
