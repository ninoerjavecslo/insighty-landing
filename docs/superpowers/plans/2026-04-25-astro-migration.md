# Astro Migration — Insighty Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite + HTML-injection build system with Astro, converting the landing page to an atomic design system with TypeScript, while preserving all visual output and vanilla JS behavior.

**Architecture:** Astro static-output site (`output: 'static'`), no SSR adapter needed for Netlify. Components follow atoms → molecules → organisms hierarchy. BaseLayout wraps all pages with typed SEO props, FOUC prevention, and bundled JS via Astro's Vite pipeline.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `@astrojs/sitemap`, vanilla JS (unchanged), Netlify static hosting.

**Spec:** `docs/superpowers/specs/2026-04-25-astro-migration-design.md`

---

## Chunk 1: Bootstrap

### Task 1: Install Astro and update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Astro and new dependencies**

```bash
npm install astro @astrojs/sitemap typescript
```

- [ ] **Step 2: Remove old build dependencies**

```bash
npm uninstall vite vite-plugin-html-inject terser
```

- [ ] **Step 3: Update `package.json` scripts**

Replace the `scripts` block in `package.json`:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "format": "prettier --write ."
}
```

- [ ] **Step 4: Verify `package.json` has no Vite references in dependencies**

```bash
grep -E '"vite":|"vite-plugin|"terser"' package.json
```

Expected: no matches (`@tailwindcss/vite` stays but won't match this pattern).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace Vite with Astro dependencies"
```

---

### Task 2: Create Astro config and TypeScript config

**Files:**
- Create: `astro.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `astro.config.ts`**

```ts
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://insighty.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {}
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add astro.config.ts tsconfig.json
git commit -m "chore: add Astro config and TypeScript config"
```

---

## Chunk 2: CSS & Tokens

### Task 3: Rename CSS files and fix imports

**Files:**
- Rename: `src/styles/variables.css` → `src/styles/tokens.css`
- Rename: `src/styles/main.css` → `src/styles/global.css`

- [ ] **Step 1: Rename `variables.css` to `tokens.css`**

```bash
mv src/styles/variables.css src/styles/tokens.css
```

- [ ] **Step 2: Rename `main.css` to `global.css`**

```bash
mv src/styles/main.css src/styles/global.css
```

- [ ] **Step 3: Update the first import in `src/styles/global.css`**

Change:
```css
@import './variables';
```
To:
```css
@import './tokens.css';
```

Also update all other imports to use explicit `.css` extensions. The complete `src/styles/global.css` should be:

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

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "chore: rename variables.css→tokens.css, main.css→global.css"
```

---

## Chunk 3: BaseLayout

### Task 4: Create BaseLayout.astro

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
interface Props {
  title: string
  description: string
  ogImage?: string
}

const {
  title,
  description,
  ogImage = '/images/og-image.png',
} = Astro.props

import '../styles/global.css'
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Insighty" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Theme -->
    <meta name="theme-color" content="#000000" />
    <meta name="msapplication-TileColor" content="#000000" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />

    <!-- FOUC prevention: apply saved theme class before paint -->
    <script is:inline>
      const theme = localStorage.getItem('color-theme')
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      }
    </script>
  </head>
  <body class="dark:bg-background-8 bg-white">
    <slot />

    <!-- Vendor scripts (static, loaded before main bundle) -->
    <script is:inline src="/vendor/lenis.min.js"></script>
    <script is:inline src="/vendor/gsap.min.js"></script>
    <script is:inline src="/vendor/scroll-trigger.min.js"></script>
    <script is:inline src="/vendor/split-text.min.js"></script>
    <script is:inline src="/vendor/draw-svg.min.js"></script>
    <script is:inline src="/vendor/motionpathplugin.min.js"></script>
    <script is:inline src="/vendor/springer.min.js"></script>
    <script is:inline src="/vendor/swiper.min.js"></script>
    <script is:inline src="/vendor/leaflet.min.js"></script>
    <script is:inline src="/vendor/vanilla-infinite-marquee.min.js"></script>
    <script is:inline src="/vendor/number-counter.js"></script>
    <script is:inline src="/vendor/stack-card.min.js"></script>

    <!-- Main JS bundle (Astro bundles all imports from src/main.js) -->
    <script>
      import '../main.js'
    </script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout.astro with SEO, FOUC prevention, and JS loading"
```

---

### Task 5: Create placeholder index.astro and verify dev server

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create minimal `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout
  title="Insighty — Coming Soon | Agency Operations Platform"
  description="Insighty brings every client, project, contract, and revenue stream into one intelligent dashboard. Coming soon to help agencies scale profitably."
>
  <p>Landing page coming soon</p>
</BaseLayout>
```

- [ ] **Step 2: Start dev server and verify it loads**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: page loads with "Landing page coming soon", no build errors in console. Check browser DevTools for CSS loading.

- [ ] **Step 3: Verify build succeeds**

```bash
npm run build
```

Expected: `dist/` created, `dist/index.html` exists, `dist/sitemap-index.xml` exists, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add placeholder index.astro, verify Astro dev server works"
```

---

## Chunk 4: Static Assets

### Task 6: Rename logo image and create robots.txt

**Files:**
- Rename: `public/images/shared/insighty_logo_v2_caps_c%20(1).png` → `public/images/shared/insighty_logo.png`
- Create: `public/robots.txt`

- [ ] **Step 1: Rename the URL-encoded logo filename**

```bash
mv "public/images/shared/insighty_logo_v2_caps_c%20(1).png" "public/images/shared/insighty_logo.png"
```

- [ ] **Step 2: Verify the file renamed correctly**

```bash
ls public/images/shared/insighty_logo.png
```

Expected: file exists.

- [ ] **Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://insighty.io/sitemap-index.xml
```

- [ ] **Step 4: Commit**

```bash
git add public/images/shared/insighty_logo.png public/robots.txt
git commit -m "chore: rename logo image, add robots.txt"
```

---

## Chunk 5: Atoms

### Task 7: Create atom components

**Files:**
- Create: `src/components/atoms/ThemeToggle.astro`
- Create: `src/components/atoms/Star.astro`
- Create: `src/components/atoms/AccordionIcon.astro`
- Create: `src/components/atoms/HoverBg.astro`
- Create: `src/components/atoms/TestimonialStar.astro`

Note: `package-link.htm` contains vendor `<script>` tags — this is handled in BaseLayout, not as an atom. `menu-icon/` contains navigation icon SVGs that are inlined in Header.astro directly.

- [ ] **Step 1: Create `src/components/atoms/ThemeToggle.astro`**

```astro
---
interface Props {
  defaultTheme?: 'light' | 'dark'
}
const { defaultTheme = 'light' } = Astro.props
---
<button
  id="theme-toggle"
  data-default-theme={defaultTheme}
  aria-label="Theme toggle button"
  class="size-12 bg-background-8 !z-[9999] dark:bg-white rounded-l-2xl cursor-pointer flex items-center justify-center fixed right-0 bottom-5"
>
  <span id="dark-theme-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-black">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  </span>
  <span id="light-theme-icon">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="size-6 stroke-white">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  </span>
</button>
```

- [ ] **Step 2: Create `src/components/atoms/Star.astro`**

```astro
---
interface Props {
  class?: string
}
const { class: className = '' } = Astro.props
---
<svg xmlns="http://www.w3.org/2000/svg" class="size-[15px]" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path
    d="M7.25672 0.486272C7.53172 -0.162091 8.46832 -0.162091 8.74332 0.486274L10.3663 4.31303C10.4823 4.58637 10.7445 4.77313 11.0454 4.79678L15.2582 5.12799C15.9719 5.18411 16.2614 6.05763 15.7175 6.51446L12.5079 9.2107C12.2786 9.40331 12.1784 9.70552 12.2485 9.99343L13.2291 14.0249C13.3952 14.7079 12.6375 15.2478 12.0264 14.8818L8.41965 12.7214C8.16202 12.5671 7.83802 12.5671 7.5804 12.7214L3.9736 14.8818C3.3625 15.2478 2.60477 14.7079 2.77091 14.0249L3.75155 9.99343C3.82159 9.70552 3.72147 9.40331 3.49221 9.2107L0.28245 6.51446C-0.261375 6.05763 0.0280544 5.18411 0.741835 5.12799L4.9547 4.79678C5.25561 4.77313 5.51774 4.58637 5.63367 4.31303L7.25672 0.486272Z"
    class={`fill-[#864FFE] ${className}`}
  />
</svg>
```

- [ ] **Step 3: Create `src/components/atoms/AccordionIcon.astro`**

```astro
---
---
<span class="accordion-arrow ml-2.5 block sm:ml-auto">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
    <path stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" class="stroke-secondary dark:stroke-accent" />
  </svg>
</span>
```

- [ ] **Step 4: Create `src/components/atoms/HoverBg.astro`**

```astro
---
interface Props {
  class?: string
}
const { class: className = '' } = Astro.props
---
<div class={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background-3 dark:bg-background-7 opacity-0 group-hover:opacity-100 rounded-[10px] z-0 transition-all duration-400 ${className}`}></div>
```

- [ ] **Step 5: Create `src/components/atoms/TestimonialStar.astro`**

```astro
---
interface Props {
  class?: string
}
const { class: className = '' } = Astro.props

const starPath = "M7.25672 1.39741C7.53172 0.749041 8.46832 0.749042 8.74332 1.39741L10.3663 5.22417C10.4823 5.4975 10.7445 5.68426 11.0454 5.70792L15.2582 6.03912C15.9719 6.09524 16.2614 6.96876 15.7175 7.42559L12.5079 10.1218C12.2786 10.3144 12.1784 10.6167 12.2485 10.9046L13.2291 14.936C13.3952 15.6191 12.6375 16.159 12.0264 15.793L8.41965 13.6325C8.16202 13.4782 7.83802 13.4782 7.5804 13.6325L3.9736 15.793C3.3625 16.159 2.60477 15.6191 2.77091 14.936L3.75155 10.9046C3.82159 10.6167 3.72147 10.3144 3.49221 10.1218L0.28245 7.42559C-0.261375 6.96876 0.0280544 6.09524 0.741835 6.03912L4.9547 5.70792C5.25561 5.68426 5.51774 5.4975 5.63367 5.22417L7.25672 1.39741Z"
---
<span class="flex items-center justify-start gap-x-1">
  {Array.from({ length: 5 }).map(() => (
    <svg xmlns="http://www.w3.org/2000/svg" class={`fill-primary-500 size-[12px] ${className}`} viewBox="0 0 16 17" fill="none">
      <path d={starPath} />
    </svg>
  ))}
</span>
```

> The `<clipPath>` was removed — it only clips to the full rect, which has no visual effect, and removing it avoids duplicate ID issues when this component is used multiple times on the same page.

- [ ] **Step 6: Commit**

```bash
git add src/components/atoms/
git commit -m "feat: add atom components (ThemeToggle, Star, AccordionIcon, HoverBg, TestimonialStar)"
```

---

## Chunk 6: Molecules

### Task 8: Create molecule components

**Files:**
- Create: `src/components/molecules/AccordionItem.astro`
- Create: `src/components/molecules/FeatureCard.astro`
- Create: `src/components/molecules/NavItem.astro`
- Create: `src/components/molecules/TestimonialCard.astro`

- [ ] **Step 1: Create `src/components/molecules/AccordionItem.astro`**

```astro
---
interface Props {
  question: string
  answer: string
  isOpen?: boolean
}
const { question, answer, isOpen = false } = Astro.props
---
<div class={`accordion-item border-stroke-1 dark:border-stroke-6 rounded-[20px] border ${isOpen ? 'active-accordion' : ''}`}>
  <button class="accordion-action flex w-full cursor-pointer items-center justify-between p-4 md:p-6 lg:p-8">
    <span class="xl:text-heading-6 text-tagline-1 text-secondary dark:text-accent flex-1 text-left font-normal">
      {question}
    </span>
    <span class="data-[state=true]:bg-secondary dark:data-[state=true]:bg-accent data-[state=false]:bg-primary-700 accordion-arrow ml-2.5 flex size-7 items-center justify-center rounded-full transition-colors duration-300 ease-in-out sm:ml-auto">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none" class="dark:data-[state=true]:stroke-secondary data-[state=false]:stroke-white transition-colors duration-300 ease-in-out data-[state=true]:stroke-white">
        <path d="M9 0.910156L5 4.91016L1 0.910156" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
  </button>
  <div class="accordion-content">
    <div class="px-8 pb-8">
      <p>{answer}</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `src/components/molecules/FeatureCard.astro`**

```astro
---
interface Props {
  iconClass: string
  title: string
  description: string
  delay?: number
}
const { iconClass, title, description, delay = 0.2 } = Astro.props
---
<div
  data-ns-animate
  data-delay={String(delay)}
  class="bg-white dark:bg-background-8 border border-stroke-1/10 dark:border-stroke-5 rounded-[20px] p-6 md:p-8 space-y-5"
>
  <div class="flex items-start gap-4">
    <span class="bg-background-3 dark:bg-background-6 inline-flex items-center justify-center size-11 rounded-xl">
      <span class={`${iconClass} text-secondary dark:text-accent text-[22px]`}></span>
    </span>
  </div>
  <div class="space-y-2">
    <p class="text-heading-6 font-medium text-secondary dark:text-accent">{title}</p>
    <p class="text-tagline-1 font-normal">{description}</p>
  </div>
</div>
```

- [ ] **Step 3: Create `src/components/molecules/NavItem.astro`**

```astro
---
interface Props {
  href: string
  label: string
}
const { href, label } = Astro.props
---
<li class="py-2.5">
  <a
    href={href}
    class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"
  >
    <span>{label}</span>
  </a>
</li>
```

- [ ] **Step 4: Create `src/components/molecules/TestimonialCard.astro`**

```astro
---
import TestimonialStar from '../atoms/TestimonialStar.astro'

interface Props {
  quote: string
  author: string
  role: string
  avatar?: string
}
const { quote, author, role, avatar } = Astro.props
---
<div class="bg-white dark:bg-background-8 border border-stroke-1/10 dark:border-stroke-5 rounded-[20px] p-6 md:p-8 space-y-5">
  <TestimonialStar />
  <p class="text-tagline-1 font-normal text-secondary dark:text-accent">"{quote}"</p>
  <div class="flex items-center gap-3">
    {avatar && <img src={avatar} alt={author} class="size-10 rounded-full object-cover" />}
    <div>
      <p class="text-tagline-2 font-medium text-secondary dark:text-accent">{author}</p>
      <p class="text-tagline-3 text-secondary/60 dark:text-accent/60">{role}</p>
    </div>
  </div>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/molecules/
git commit -m "feat: add molecule components (AccordionItem, FeatureCard, NavItem, TestimonialCard)"
```

---

## Chunk 7: Header and Footer Organisms

### Task 9: Create Header.astro

**Files:**
- Create: `src/components/organisms/Header.astro`

The header has two parts inlined: the desktop nav bar and the mobile sidebar. Both are combined into one `Header.astro` — the mobile menu is NOT a separate component since it uses a `<Component>` in the original and they share state (same JS handles open/close).

- [ ] **Step 1: Create `src/components/organisms/Header.astro`**

```astro
---
import ThemeToggle from '../atoms/ThemeToggle.astro'
---
<header>
  <div
    class="header-one lp:!max-w-[1290px] bg-background-2 dark:border-stroke-6 dark:bg-background-9 fixed top-5 left-1/2 z-50 mx-auto flex w-full max-w-[350px] -translate-x-1/2 items-center justify-between rounded-2xl px-2.5 py-2.5 opacity-0 backdrop-blur-[15px] max-[400px]:max-w-[350px] min-[425px]:max-w-[375px] min-[500px]:max-w-[450px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] xl:py-0 dark:border"
    data-ns-animate
    data-direction="up"
    data-offset="100"
  >
    <!-- Logo -->
    <div>
      <a href="/">
        <span class="sr-only">Home</span>
        <figure class="hidden lg:block lg:max-w-[140px]">
          <img src="/images/shared/insighty_logo.png" alt="Insighty" class="w-full" />
        </figure>
        <figure class="block max-w-[110px] lg:hidden">
          <img src="/images/shared/insighty_logo.png" alt="Insighty" class="w-full" />
        </figure>
      </a>
    </div>

    <!-- Desktop nav -->
    <nav class="hidden items-center xl:flex">
      <ul class="flex items-center">
        <li class="py-2.5">
          <a href="#platform" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>Platform</span></a>
        </li>
        <li class="py-2.5">
          <a href="#product-tour" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>Product Tour</span></a>
        </li>
        <li class="py-2.5">
          <a href="#pixel-ai" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>Pixel AI</span></a>
        </li>
        <li class="py-2.5">
          <a href="#integrations" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>Integrations</span></a>
        </li>
        <li class="py-2.5">
          <a href="#impact" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>Impact</span></a>
        </li>
        <li class="py-2.5">
          <a href="#faq" class="hover:border-stroke-2 dark:hover:border-stroke-7 text-tagline-2 uppercase tracking-wider text-secondary/85 hover:text-secondary dark:text-accent/80 dark:hover:text-accent flex items-center rounded-full border border-transparent px-4 py-2 font-medium transition-all duration-200"><span>FAQ</span></a>
        </li>
      </ul>
    </nav>

    <!-- Desktop CTA -->
    <div class="hidden items-center justify-center xl:flex">
      <a href="/signup" class="btn btn-md btn-secondary dark:btn-accent hover:btn-primary !rounded-none">
        <span>Request a Demo</span>
      </a>
    </div>

    <!-- Mobile hamburger -->
    <div class="block xl:hidden">
      <button class="nav-hamburger bg-background-4 dark:bg-background-6 flex size-12 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full">
        <span class="sr-only">Menu</span>
        <span class="bg-stroke-9 dark:bg-stroke-1 block h-0.5 w-6"></span>
        <span class="bg-stroke-9 dark:bg-stroke-1 block h-0.5 w-6"></span>
        <span class="bg-stroke-9 dark:bg-stroke-1 block h-0.5 w-6"></span>
      </button>
    </div>
  </div>

  <!-- Mobile sidebar -->
  <aside class="sidebar dark:bg-background-8 scroll-bar fixed top-0 right-0 z-[9999] h-screen w-full translate-x-full bg-white transition-all duration-300 sm:w-[380px] xl:hidden">
    <div class="flex flex-col h-full p-6 sm:p-8">
      <div class="flex items-center justify-between mb-8">
        <a href="/">
          <span class="sr-only">Home</span>
          <figure class="max-w-[120px]">
            <img src="/images/shared/insighty_logo.png" alt="Insighty" class="w-full" />
          </figure>
        </a>
        <button class="nav-hamburger-close bg-background-4 dark:bg-background-9 relative flex size-10 cursor-pointer items-center justify-center rounded-full">
          <span class="sr-only">Close Menu</span>
          <span class="bg-stroke-9/60 dark:bg-stroke-1 absolute block h-0.5 w-4 rotate-45"></span>
          <span class="bg-stroke-9/60 dark:bg-stroke-1 absolute block h-0.5 w-4 -rotate-45"></span>
        </button>
      </div>
      <nav class="flex-1">
        <ul class="space-y-1">
          <li><a href="#platform" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">Platform</a></li>
          <li><a href="#product-tour" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">Product Tour</a></li>
          <li><a href="#pixel-ai" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">Pixel AI</a></li>
          <li><a href="#integrations" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">Integrations</a></li>
          <li><a href="#impact" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">Impact</a></li>
          <li><a href="#faq" class="nav-hamburger-close text-secondary dark:text-accent text-heading-6 font-normal block py-3 border-b border-stroke-1/10 dark:border-stroke-5 transition-colors hover:text-primary-500">FAQ</a></li>
        </ul>
      </nav>
      <div class="mt-6">
        <a href="/signup" class="btn btn-primary btn-md w-full justify-center">
          <span>Request a Demo</span>
        </a>
      </div>
    </div>
  </aside>

  <ThemeToggle defaultTheme="light" />
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/organisms/Header.astro
git commit -m "feat: add Header organism with desktop nav, mobile sidebar, ThemeToggle"
```

---

### Task 10: Create Footer.astro

**Files:**
- Create: `src/components/organisms/Footer.astro`

Copy the content from `src/components/pages/risk-management-software/footer.htm`, replace `./images/` with `/images/`, replace `.html` links with clean paths.

- [ ] **Step 1: Create `src/components/organisms/Footer.astro`**

Copy the full HTML from `src/components/pages/risk-management-software/footer.htm` into a new file:

```astro
---
---
<!-- paste footer.htm content here, then apply the edits below -->
```

Apply these edits after pasting:
1. Replace all `./images/` with `/images/`
2. Replace `insighty_logo_v2_caps_c%20(1).png` with `insighty_logo.png`
3. **Delete** these 3 lines at the very end of `<footer>` — they are handled by `BaseLayout.astro` and `Header.astro` and must NOT be duplicated:
   ```
   <Component src="src/components/shared/theme-toggle.htm" />
   <Component src="src/components/shared/package-link.htm" />
   <script type="module" src="./src/main.js"></script>
   ```

- [ ] **Step 2: Verify footer has no `./` paths remaining**

```bash
grep "\./images\|\.html" src/components/organisms/Footer.astro
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/Footer.astro
git commit -m "feat: add Footer organism"
```

---

## Chunk 8: Content Organisms

### Task 11: Create Hero.astro

**Files:**
- Create: `src/components/organisms/Hero.astro`

Copy from `src/components/pages/risk-management-software/hero.htm`. Replace `./` paths with `/`. Replace `./contact.html` with `/contact`.

- [ ] **Step 1: Create `src/components/organisms/Hero.astro`**

```astro
---
---
<!-- Copy full content of src/components/pages/risk-management-software/hero.htm here -->
<!-- Replace all ./images/ with /images/ -->
<!-- Replace ./contact.html with /contact -->
<!-- Replace ./signup.html with /signup -->
```

- [ ] **Step 2: Verify no `./` paths remain**

```bash
grep "\./images\|\.html" src/components/organisms/Hero.astro
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/Hero.astro
git commit -m "feat: add Hero organism"
```

---

### Task 12: Create Modules.astro

**Files:**
- Create: `src/components/organisms/Modules.astro`

Copy from `src/components/pages/risk-management-software/modules.htm`. This section uses `FeatureCard` molecule — you may inline the card markup or import `FeatureCard` and pass the data as props. Inlining is fine for a single section.

- [ ] **Step 1: Create `src/components/organisms/Modules.astro`**

```astro
---
---
<!-- Copy full content of src/components/pages/risk-management-software/modules.htm here -->
<!-- Replace all ./images/ with /images/ -->
```

- [ ] **Step 2: Commit**

```bash
git add src/components/organisms/Modules.astro
git commit -m "feat: add Modules organism"
```

---

### Task 13: Create Services.astro, Feature.astro, FeatureV2.astro, FeatureV3.astro

**Files:**
- Create: `src/components/organisms/Services.astro`
- Create: `src/components/organisms/Feature.astro`
- Create: `src/components/organisms/FeatureV2.astro`
- Create: `src/components/organisms/FeatureV3.astro`

Each follows the same pattern: copy from the corresponding `.htm` file, replace `./images/` → `/images/`, replace `.html` links → clean paths.

- [ ] **Step 1: Create `src/components/organisms/Services.astro`**

Copy from `src/components/pages/risk-management-software/services.htm`. Replace paths.

- [ ] **Step 2: Create `src/components/organisms/Feature.astro`**

Copy from `src/components/pages/risk-management-software/feature.htm`. Replace paths.

- [ ] **Step 3: Create `src/components/organisms/FeatureV2.astro`**

Copy from `src/components/pages/risk-management-software/feature-v2.htm`. Replace paths.

- [ ] **Step 4: Create `src/components/organisms/FeatureV3.astro`**

Copy from `src/components/pages/risk-management-software/feature-v3.htm`. Replace paths.

- [ ] **Step 5: Verify no `./` paths in any of them**

```bash
grep -l "\./images\|\.html" src/components/organisms/Services.astro src/components/organisms/Feature.astro src/components/organisms/FeatureV2.astro src/components/organisms/FeatureV3.astro
```

Expected: no output (no files matched).

- [ ] **Step 6: Commit**

```bash
git add src/components/organisms/Services.astro src/components/organisms/Feature.astro src/components/organisms/FeatureV2.astro src/components/organisms/FeatureV3.astro
git commit -m "feat: add Services, Feature, FeatureV2, FeatureV3 organisms"
```

---

### Task 14: Create FoundingMember.astro, FAQ.astro, CTA.astro

**Files:**
- Create: `src/components/organisms/FoundingMember.astro`
- Create: `src/components/organisms/FAQ.astro`
- Create: `src/components/organisms/CTA.astro`

FAQ uses `AccordionItem` molecule. Import it and pass each FAQ item as props — or inline the accordion markup directly from the `.htm` file (either is acceptable).

- [ ] **Step 1: Create `src/components/organisms/FoundingMember.astro`**

Copy from `src/components/pages/risk-management-software/founding-member.htm`. Replace `./images/` → `/images/`.

- [ ] **Step 2: Create `src/components/organisms/FAQ.astro`**

Option A — use `AccordionItem` molecule:

```astro
---
import AccordionItem from '../molecules/AccordionItem.astro'

const faqs = [
  {
    question: "When is Insighty launching?",
    answer: "We're targeting a Q2 2026 early-access launch for waitlist members. Founding members will get first access, locked pricing, and direct input on the roadmap before we open to the public.",
    isOpen: true,
  },
  {
    question: "What size agency is Insighty built for?",
    answer: "Insighty is designed for digital agencies with 2–50 people — the range where spreadsheets break down but enterprise tools are overkill. If you're managing retainers, fixed projects, and hosting costs across multiple clients, Insighty is built for you.",
  },
  // ... add remaining FAQ items from faq.htm
]
---
<section id="faq" class="py-14 md:py-20 lg:py-28 bg-background-3 dark:bg-background-7">
  <div class="main-container">
    <div class="space-y-4 text-center mb-10 xl:mb-16">
      <span data-ns-animate data-delay="0.1" class="inline-block border border-secondary/25 text-secondary text-tagline-3 font-medium tracking-widest uppercase px-4 py-1.5">FAQ</span>
      <h2 data-ns-animate data-delay="0.2" class="mx-auto max-w-[600px]">Questions we keep getting</h2>
      <p data-ns-animate data-delay="0.3" class="mx-auto max-w-[480px]">Everything you need to know before joining the waitlist.</p>
    </div>
    <div class="accordion mx-auto w-full max-w-[950px] space-y-4" role="region">
      {faqs.map((faq) => (
        <AccordionItem question={faq.question} answer={faq.answer} isOpen={faq.isOpen} />
      ))}
    </div>
  </div>
</section>
```

Option B — copy the full HTML from `faq.htm` as-is (simpler, no data extraction needed). Either is acceptable.

- [ ] **Step 3: Create `src/components/organisms/CTA.astro`**

Copy from `src/components/pages/risk-management-software/cta.htm`. Replace `./images/` → `/images/`.

- [ ] **Step 4: Verify no `./` paths remain**

```bash
grep "\./images\|\.html" src/components/organisms/FoundingMember.astro src/components/organisms/FAQ.astro src/components/organisms/CTA.astro
```

Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add src/components/organisms/FoundingMember.astro src/components/organisms/FAQ.astro src/components/organisms/CTA.astro
git commit -m "feat: add FoundingMember, FAQ, CTA organisms"
```

---

## Chunk 9: Index Page and Final Verification

### Task 15: Wire index.astro and run full verification

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace placeholder `src/pages/index.astro` with full page**

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
<BaseLayout
  title="Insighty — Coming Soon | Agency Operations Platform"
  description="Insighty brings every client, project, contract, and revenue stream into one intelligent dashboard. Coming soon to help agencies scale profitably."
>
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

- [ ] **Step 2: Start dev server and do visual check**

```bash
npm run dev
```

Open `http://localhost:4321`. Verify:
- Header renders with logo and nav links
- All sections render in correct order
- Images display (no broken images)
- Dark mode toggle appears bottom-right
- Mobile menu opens/closes on hamburger click
- Animations trigger on scroll
- No console errors

- [ ] **Step 3: Test dark mode**

Click the theme toggle button. Expected: page switches to dark mode, preference persists on reload (no flash).

- [ ] **Step 4: Run build and check output**

```bash
npm run build
```

Expected: no build errors. Verify output files exist:

```bash
ls dist/index.html dist/sitemap-index.xml dist/robots.txt
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire index.astro with all landing page organisms"
```

---

### Task 16: Remove old build files

**Files:**
- Delete: `vite.config.js`
- Delete: `post-build.js`

- [ ] **Step 1: Delete `vite.config.js`**

```bash
rm vite.config.js
```

- [ ] **Step 2: Delete `post-build.js`**

```bash
rm post-build.js
```

- [ ] **Step 3: Verify build still succeeds without them**

```bash
npm run build
```

Expected: clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git rm vite.config.js post-build.js
git commit -m "chore: remove vite.config.js and post-build.js"
```

---

## Chunk 10: Future Organisms

### Task 17: Create Testimonial.astro and Pricing.astro (future use)

These are NOT wired into `index.astro` — they're built now so they're ready when needed.

**Files:**
- Create: `src/components/organisms/Testimonial.astro`
- Create: `src/components/organisms/Pricing.astro`

- [ ] **Step 1: Create `src/components/organisms/Testimonial.astro`**

Copy from `src/components/pages/risk-management-software/testimonial.htm`. Replace `./` paths with `/`.

- [ ] **Step 2: Create `src/components/organisms/Pricing.astro`**

Copy from `src/components/pages/risk-management-software/pricing.htm`. Replace `./` paths with `/`.

- [ ] **Step 3: Verify no `./` paths**

```bash
grep "\./images\|\.html" src/components/organisms/Testimonial.astro src/components/organisms/Pricing.astro
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/Testimonial.astro src/components/organisms/Pricing.astro
git commit -m "feat: add Testimonial and Pricing organisms (future use)"
```

---

## Done

All landing page organisms are wired, static files are in place, and the Vite build system has been removed. The `dist/` output is identical in structure to the old Vite output.

**Next pages:** follow the Incremental Page Addition pattern from the spec — create `src/pages/[name].astro`, convert its `.htm` components to `.astro`, reuse existing atoms/molecules.
