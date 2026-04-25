# Astro Migration — Insighty Landing Page

**Date:** 2026-04-25  
**Status:** Approved  
**Scope:** Migrate landing page from Vite + HTML injection to Astro with atomic design system. Other pages added incrementally afterward.

---

## Context

The current project is a Vite-based multi-page site using `vite-plugin-html-inject` for component composition. Components are `.htm` files organized under `src/components/pages/` and `src/components/shared/`. The stack is Tailwind CSS v4 + vanilla JS — no framework.

The goal is to replace Vite with Astro in-place (same repo), convert the landing page first, and add other pages one by one over time. Old `.htm` files are preserved but not deleted.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Migration approach | In-place, Option C | Clean — no hybrid build systems, no pre-built HTML fallback |
| Framework | Astro | `.htm` → `.astro` is near 1:1, natural fit for atomic design, first-class Tailwind v4 + TS |
| Language | TypeScript | Right time to add it; Astro has first-class TS; enables typed component props |
| Deployment | Netlify static | `output: 'static'` — no adapter needed; Netlify auto-detects Astro static output |
| JS | Vanilla, untouched | `src/main.js` loaded via Astro `<script>` tag (bundled by Astro's Vite pipeline) |
| Sitemap | `@astrojs/sitemap` | Auto-generates from pages at build time |
| Robots | Static `public/robots.txt` | Simple, no build step needed |
| Legacy files | Preserved in place | `src/components/pages/` and `src/components/shared/` kept, not deleted |

---

## Project Structure

```
src/
  components/
    atoms/
      Button.astro            # btn, btn-primary, btn-xl variants
      Badge.astro             # badge styles
      Icon.astro              # icon-font wrapper
      Star.astro              # ← shared/star.htm
      ThemeToggle.astro       # ← shared/theme-toggle.htm (defaultTheme prop replaces {=$default-theme})
      MenuIcon.astro          # ← shared/menu-icon/
      AccordionIcon.astro     # ← shared/accordion-icon.htm
      PackageLink.astro       # ← shared/package-link.htm
      TestimonialStar.astro   # ← shared/testimonial-star.htm

    molecules/
      NavItem.astro           # single nav link with hover styles
      NavDropdown.astro       # wraps company/platform/resources dropdown menus
      AccordionItem.astro     # FAQ row — AccordionIcon + text
      TestimonialCard.astro   # star rating + quote + author
      FeatureCard.astro       # icon + title + description tile

    organisms/
      Header.astro            # ← header.htm + mobile-menu.htm + all menu .htm files
      Hero.astro              # ← hero.htm
      Modules.astro           # ← modules.htm
      Services.astro          # ← services.htm
      Feature.astro           # ← feature.htm
      FeatureV2.astro         # ← feature-v2.htm
      FeatureV3.astro         # ← feature-v3.htm
      FoundingMember.astro    # ← founding-member.htm
      FAQ.astro               # ← faq.htm
      CTA.astro               # ← cta.htm
      Footer.astro            # ← footer.htm
      Testimonial.astro       # ← testimonial.htm (pre-built for future use; NOT in index.html)
      Pricing.astro           # ← pricing.htm (pre-built for future use; NOT in index.html)

  layouts/
    BaseLayout.astro          # HTML shell — title, description, ogImage props

  pages/
    index.astro               # landing page — see "Landing Page Composition" section

  styles/
    tokens.css                # ← variables.css renamed; @theme block unchanged
    global.css                # ← main.css renamed; @import tokens replaces @import variables
    base.css                  # unchanged
    button.css                # unchanged
    badge.css                 # unchanged
    header.css                # unchanged
    typography.css            # unchanged
    common.css                # unchanged
    navigation-menu.css       # unchanged
    icon-font.css             # unchanged
    custom-swiper.css         # unchanged
    number-animation.css      # unchanged
    vendor/                   # unchanged

  main.js                     # unchanged — JS entry point (at src/main.js, not src/js/)
  js/                         # unchanged (animation/, common/, utils/)

public/
  robots.txt                  # static — see Sitemap & Robots section
  fonts/                      # untouched
  images/                     # untouched (filenames sanitized — see Asset Paths)
  vendor/                     # untouched
  audio/, video/              # untouched
  favicon files               # untouched
  site.webmanifest            # untouched

# Legacy preserved — NOT deleted
src/components/pages/         # all original .htm files stay
src/components/shared/        # all original .htm files stay

# Removed
vite.config.js                # replaced by astro.config.ts
post-build.js                 # no longer needed (Astro handles asset naming natively)
src/styles/main.css           # renamed to global.css
src/styles/variables.css      # renamed to tokens.css
```

---

## Landing Page Composition

`src/pages/index.astro` is built from exactly the organisms listed in the current `index.html`. The authoritative list is:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Header from '../components/organisms/Header.astro'
import Hero from '../components/organisms/Hero.astro'
import Modules from '../components/organisms/Modules.astro'
import Services from '../components/organisms/Services.astro'
import Feature from '../components/organisms/Feature.astro'
import FeatureV2 from '../components/organisms/FeatureV2.astro'
import FeatureV3 from '../components/organisms/FeatureV3.astro'
import FoundingMember from '../components/organisms/FoundingMember.astro'
import FAQ from '../components/organisms/FAQ.astro'
import CTA from '../components/organisms/CTA.astro'
import Footer from '../components/organisms/Footer.astro'
---
<BaseLayout title="Insighty — Coming Soon | Agency Operations Platform" description="...">
  <Header />
  <main>
    <Hero />
    <Modules />
    <Services />
    <Feature />
    <FeatureV2 />
    <FeatureV3 />
    <FoundingMember />
    <FAQ />
    <CTA />
  </main>
  <Footer />
</BaseLayout>
```

`Testimonial.astro` and `Pricing.astro` are converted for future use but are **not included** in `index.astro`.

---

## Astro Configuration

For `output: 'static'`, no adapter is needed. Netlify auto-detects Astro's `dist/` output without a `netlify.toml` (confirmed: no `netlify.toml` exists in this repo).

```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://insighty.io', // update to real domain before deploy
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

**Install command:**

```bash
npm install astro @astrojs/sitemap typescript
```

Then remove `vite`, `vite-plugin-html-inject`, and `terser` from `package.json`.

---

## BaseLayout

`src/layouts/BaseLayout.astro` accepts typed props:

```ts
interface Props {
  title: string
  description: string
  ogImage?: string
}
```

Outputs the full `<html>` shell with:
- `<html lang="en">` — dark mode class goes here (see Dark Mode section)
- All SEO meta tags (OG, Twitter, canonical) using the props
- Favicon links
- Font preconnects (Google Fonts — Inter Tight)
- FOUC prevention inline script in `<head>` (see Dark Mode section)
- `<link rel="stylesheet">` for `global.css`
- Vendor scripts as `<script src="/vendor/...">` tags (loaded as static files, no bundling)
- `src/main.js` imported via Astro `<script>` tag
- `<slot />` for page content

### JS Loading

The JS entry point is `src/main.js`. It imports all modules from `src/js/animation/`, `src/js/common/`, and `src/js/utils/` via ES `import` statements.

In `BaseLayout.astro`, it is loaded as:

```astro
<script>
  import '../main.js'
</script>
```

Astro's built-in Vite pipeline processes this, bundles all imports, and outputs the bundle to `dist/`. This replaces the old `jsToBottomNoModule` Vite plugin and the `post-build.js` script. No manual manipulation is needed.

Vendor scripts in `public/vendor/` remain as static files and load via `<script src="/vendor/filename.js">` tags before `</body>`.

---

## Tokens & Tailwind v4

`src/styles/variables.css` is **renamed** to `src/styles/tokens.css`. Content is unchanged.

`src/styles/main.css` is **renamed** to `src/styles/global.css`. The only change is the first import:

```css
/* Before */
@import './variables';

/* After */
@import './tokens.css';
```

All other imports stay identical. Explicit `.css` extensions are used throughout to avoid any Vite resolution edge cases.

Complete `global.css`:

```css
@import './tokens.css';
@import './icon-font.css';
@import './typography.css';
@import './common.css';
@import 'tailwindcss';
@import './base.css';
@import './button.css';
@import './badge.css';
@import './header.css';
@import './navigation-menu.css';
@import './vendor/vanilla-infinite-marquee.min.css';
@import './vendor/swiper.min.css';
@import './vendor/leaflet.min.css';
@import './custom-swiper.css';
@import './number-animation.css';

@custom-variant dark (&:where(.dark, .dark *));
```

---

## Dark Mode

The `dark` class is applied to `<html>`, not `<body>`. The current `index.html` uses `<body class="dark:bg-background-8 bg-white">` — this moves to the `<body>` tag inside `BaseLayout.astro` unchanged, but the toggle target is `<html>`.

To prevent flash-of-wrong-theme (FOUC), a small inline script runs in `<head>` before any CSS paints:

```html
<script is:inline>
  const theme = localStorage.getItem('color-theme')
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
</script>
```

`is:inline` tells Astro not to bundle or defer this script — it runs synchronously. The existing `force-theme-switcher.js` and `theme-switcher.js` in `src/js/utils/` handle runtime toggling and remain untouched.

---

## Asset Path Migration

### Base Path Change

The current Vite config sets `base: './'`, producing relative asset paths (`./assets/main.js`). Astro defaults to `base: '/'`, producing absolute paths (`/assets/main.js`). This affects:

- Any hardcoded relative paths inside JS files (e.g. fetch calls, audio/video `src` constructed from strings)
- Any `url()` references in CSS that point to assets

**Audit required:** Before considering the migration complete, grep for `'./'` string patterns in `src/js/` files and confirm none construct asset URLs relative to the document location. Static HTML attribute `src="./images/..."` references are fine — browsers resolve those — but JS-constructed paths need to be absolute (`/images/...`).

### URL-encoded and Special-Character Filenames

At least one image has a problematic filename: `insighty_logo_v2_caps_c%20(1).png` (used in `header.htm` and `mobile-menu.htm`). Astro's static file serving does not apply URL-decoding to filenames on disk.

**Migration step:**
1. Rename the file on disk to remove spaces and special characters: `insighty_logo.png`
2. Find all references: `grep -r "insighty_logo" src/`
3. Update every reference in the converted `.astro` files to `/images/shared/insighty_logo.png`

Apply the same process to any other files in `public/images/` with spaces or special characters.

---

## Component Conversion Pattern

Each `.htm` file becomes an `.astro` file. The conversion is mechanical:

1. Copy HTML content into the `.astro` file's template section
2. Extract any hardcoded values that should be props into the frontmatter `interface Props` block
3. Replace `./` relative asset paths with `/` absolute paths (Astro serves from `public/`)
4. Replace `<Component src="..." />` references with direct `import` + usage in frontmatter
5. Replace `vite-plugin-html-inject` template variables (`{=$variable-name}`) with typed Astro props

### Template Variable Conversion

The old system supported variables like `{=$default-theme}` in `theme-toggle.htm`. These become explicit typed props:

```astro
---
interface Props {
  defaultTheme?: 'light' | 'dark'
}
const { defaultTheme = 'light' } = Astro.props
---
<button data-default-theme={defaultTheme}>...</button>
```

---

## Sitemap & Robots

`@astrojs/sitemap` generates `/sitemap-index.xml` automatically at build time. No extra configuration beyond the integration and `site` in `astro.config.ts`.

`public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://insighty.io/sitemap-index.xml
```

---

## Incremental Page Addition

After the landing page is working, each subsequent page follows this pattern:

1. Create `src/pages/[page-name].astro`
2. Convert the relevant `src/components/pages/[page-name]/` `.htm` files to `.astro`
3. Reuse existing atoms/molecules where they apply; add new ones to the design system if needed
4. Sitemap updates automatically at next build

Legacy `.htm` files remain in place throughout — they serve as reference and are only removed once their page is fully converted.

---

## Dependencies

**Remove:**
- `vite`
- `vite-plugin-html-inject`
- `terser`

**Add:**
- `astro`
- `@astrojs/sitemap`
- `typescript`

**Stay (no change):**
- `@tailwindcss/vite`
- `tailwindcss`
- `prettier`
- `prettier-plugin-tailwindcss`

---

## Success Criteria

- `npm run dev` starts Astro dev server, landing page renders correctly
- `npm run build` produces static output in `dist/` with no errors
- All sections of the landing page render visually identically to the current Vite build
- `/sitemap-index.xml` exists in build output
- `/robots.txt` exists in build output
- Dark mode toggle works with no flash-of-wrong-theme
- All animations and vanilla JS behaviors work
- Netlify deploy succeeds
- `post-build.js` and `vite.config.js` are removed
- No URL-encoded image filenames remain in `public/images/`
