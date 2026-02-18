
# Site Audit: Performance, Code Quality, and UX

## Summary

The site is well-built overall with good patterns (React Query caching, lazy loading, responsive images, IntersectionObserver). However, there are several issues worth addressing across performance, code consistency, and UX.

---

## Issues Found

### 1. Inconsistent Data Fetching Patterns (Code Quality)
- **Hero, MeetMarc, FailuresFirsts, Speaking, Podcasts** all use React Query hooks -- great.
- **Movement and Contact** use raw `useEffect` + `useState` with direct Supabase calls -- no caching, no error handling, no loading states.
- **Fix**: Migrate Movement and Contact to React Query hooks (`useMovementContent`, `useContactContent`) for consistency, caching, and error handling.

### 2. Footer Copyright Year is Hardcoded (UX)
- Footer reads `2017-2025` but the current year is 2026.
- **Fix**: Use `new Date().getFullYear()` to keep it current automatically.

### 3. Footer Text Color Bug (Visual)
- Line 34 in Footer: `text-[F2F2F2]` is missing the `#` -- this means the color is not applied and the text may be invisible or default.
- **Fix**: Change to `text-[#F2F2F2]`.

### 4. Movement Section `mb-[200px]` Excessive Spacing (UX)
- The video container has `mb-[200px]` which creates an unusually large gap between the video and the quote below it. This may be intentional for dramatic effect, but it could feel like broken layout on smaller screens.
- **Fix**: Consider reducing or making it responsive, e.g., `mb-24 md:mb-32 lg:mb-48`.

### 5. Carousel Slides Missing Captions (UX)
- The FailuresFirsts carousel renders slide images but does not display `caption` or `subcaption` text anywhere visible to users -- only in the `alt` attribute. These fields exist in the database and have content.
- **Fix**: Add visible caption/subcaption overlay or text below each slide.

### 6. Social Component Elfsight Script Cleanup Issue (Performance)
- The Elfsight script is appended to `document.body` and removed on unmount, but Elfsight scripts typically inject additional DOM elements that persist. The cleanup only removes the script tag itself, not the widget. If a user navigates away and back, it may duplicate.
- **Fix**: Add a guard to check if the script is already loaded before appending.

### 7. MeetMarc Scroll Animation Not Used (Dead Code)
- `useScrollAnimation` is called for `headerAnimation` and `cardAnimation` in MeetMarc, but `isVisible` is never consumed -- the elements always show `opacity-100 translate-y-0 animate-fade-in` regardless of the scroll state.
- **Fix**: Wire `isVisible` into the className to actually animate on scroll, or remove the unused hook calls.

### 8. PeaksValleys Component is Imported but Commented Out (Dead Code)
- `PeaksValleys` is imported in Index.tsx but commented out in the JSX. The component file still exists with hardcoded data.
- **Fix**: Either remove the import and component file entirely, or re-enable it.

### 9. `dangerouslySetInnerHTML` in Hero (Security)
- The hero title uses `dangerouslySetInnerHTML` to render content from the database. If an admin account is compromised, this could inject malicious HTML/JS.
- **Fix**: Sanitize the HTML before rendering, or use a safer approach if only line breaks are needed.

### 10. LoadingScreen Never Unmounts from DOM (Performance)
- The loading screen stays in the DOM permanently (just with `opacity-0 pointer-events-none`). It should be fully removed after the fade-out transition completes.
- **Fix**: Add an `onTransitionEnd` handler or a timeout to fully unmount the component.

---

## Implementation Plan

### Step 1: Fix Footer bugs
- Change `text-[F2F2F2]` to `text-[#F2F2F2]`
- Replace hardcoded `2025` with dynamic year: `` {`\u00A9 2017\u2013${new Date().getFullYear()} Marc Hodulich. All rights reserved.`} ``

### Step 2: Create React Query hooks for Movement and Contact
- Create `src/hooks/useMovementContent.ts` and `src/hooks/useContactContent.ts`
- Refactor both components to use these hooks instead of raw `useEffect`
- This gives them caching, error handling, and consistency with other components

### Step 3: Fix MeetMarc scroll animation (wire up `isVisible`)
- Update the className logic to use `isVisible` from the hook:
  - When not visible: `opacity-0 translate-y-8`
  - When visible: `opacity-100 translate-y-0`
- Remove the unconditional `animate-fade-in` class that overrides the scroll behavior

### Step 4: Remove PeaksValleys dead code
- Remove the commented-out `<PeaksValleys />` from Index.tsx
- Remove the unused import

### Step 5: Fix LoadingScreen unmounting
- Add state to fully remove from DOM after fade-out completes
- Use a timeout matching the 800ms transition duration

### Step 6: Fix Social Elfsight script duplication guard
- Check `document.querySelector('script[src*="elfsightcdn"]')` before appending

### Step 7: Add carousel captions
- Display `caption` and `subcaption` as text overlay or below each slide image

### Step 8: Reduce Movement section bottom margin
- Replace `mb-[200px]` with responsive spacing like `mb-24 md:mb-32 lg:mb-48`

### Step 9: Sanitize Hero `dangerouslySetInnerHTML`
- Use a simple sanitizer to strip script tags and event handlers, allowing only safe HTML like `<br>` and `<span>`

---

## Technical Details

**Files to create:**
- `src/hooks/useMovementContent.ts`
- `src/hooks/useContactContent.ts`

**Files to modify:**
- `src/components/Footer.tsx` (color fix + dynamic year)
- `src/components/Movement.tsx` (use new hook, fix spacing)
- `src/components/Contact.tsx` (use new hook)
- `src/components/MeetMarc.tsx` (wire scroll animations)
- `src/components/Social.tsx` (script duplication guard)
- `src/components/FailuresFirsts.tsx` (add captions)
- `src/components/Hero.tsx` (sanitize HTML)
- `src/components/LoadingScreen.tsx` (unmount after fade)
- `src/pages/Index.tsx` (remove PeaksValleys import)
