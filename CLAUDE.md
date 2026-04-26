# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at localhost:4321
npm run build      # production build to dist/
npm run preview    # preview production build
npm run format     # Prettier (with tailwindcss plugin)
```

No test suite exists. Type-check via `npx astro check`.

## Stack

- **Astro 6** — static output (`output: 'static'`), site: `https://insighty.io`
- **Tailwind CSS v4** — configured via `@tailwindcss/vite` plugin; design tokens in `src/styles/tokens.css` using `@theme {}` block, not `tailwind.config.*`
- **GSAP + ScrollTrigger + SplitText** — loaded as vendored globals from `public/vendor/`; imported as `is:inline defer` scripts in `BaseLayout.astro`. Custom spring physics via `Springer`.
- **Lenis** — smooth scroll, loaded globally the same way.

## Architecture

### Entry point

All pages wrap in `src/layouts/BaseLayout.astro`, which loads all vendor scripts and imports `src/main.js`. `main.js` initialises every JS module (animations, interactions) on every page — there is no per-page tree-shaking of JS.

### Component layers

```
atoms/       — single-element primitives (Logo, ThemeToggle, Star, etc.)
molecules/   — composed UI units (BlogCard, NavItem, TestimonialCard, etc.)
organisms/   — full page sections (Header, Hero, Feature, Pricing, Footer, etc.)
pages/       — .htm/.html template fragments from the original HTML starter; NOT used by the Astro build
```

> The `src/components/pages/` directory is **dead code** — these are leftover `.htm` fragments from the HTML theme that was used to bootstrap the project. Nothing in `src/pages/` imports them.

### Pages

`src/pages/` is the live site:
- `index.astro` — homepage (composes all organisms)
- `pricing.astro`, `founding-member.astro`, `request-a-demo.astro` — conversion pages
- `use-cases/[segment].astro` — one file per segment (agency, freelancer, accounting-finance, it-services, business-operations). `template.astro` is the pattern file, excluded from sitemap.
- `compare/insighty-vs-[competitor].astro` — ~20 SEO comparison pages, each self-contained with structured data props
- `tools/` — 6 standalone calculator pages
- `blog/` — blog index + `[...slug].astro` dynamic route powered by Astro Content Collections

### Content

Blog posts live in `src/content/blog/*.md`. Schema defined in `src/content.config.ts`:
- Required fields: `title`, `description`, `pubDate`, `category` (enum), `readTime`
- Optional: `featured` (bool, default false), `thumbnail`

### Styling

**Never use `tailwind.config.*`** — this project uses Tailwind v4's CSS-first config. All tokens are in `src/styles/tokens.css` inside `@theme {}`. The import chain is:

```
global.css → tokens.css, typography.css, common.css, tailwindcss, base.css, button.css, badge.css, header.css, navigation-menu.css, ...vendors
```

**Dark mode** is class-based (`html.dark`), implemented via `@custom-variant dark (&:where(.dark, .dark *))` in `global.css`. The site ships dark by default.

**Color opacity gotcha**: `--color-secondary: #181818cf` has an alpha channel baked in (`cf` = 81%). Tailwind's opacity modifier compounds with this — `text-secondary/60` produces ~49% effective opacity, not 60%. To get readable body text, use `text-secondary` (no modifier) or high modifiers (`/85`+).

**Default `<p>` style** (in `src/styles/base.css`): `text-secondary dark:text-accent` — no opacity modifier, full contrast.

### Animation system

Elements with `data-ns-animate` are scroll-revealed via GSAP + ScrollTrigger in `src/js/common/reveal-elements.js`. Supported attributes:
- `data-delay="0.2"` — seconds
- `data-direction="up|down|left|right"`
- `data-offset="60"` — translate distance in px
- `data-duration="0.6"`
- `data-spring` — use Springer physics curve

### Header mega-menu

`Header.astro` renders two dropdown menus (Solutions, Resources) as fixed-position overlays managed by vanilla JS in `src/js/animation/header.js`. Blog posts in the nav are pulled live from the content collection (`getCollection('blog')`), sorted by date, sliced to 3.

### Compare page pattern

Each `compare/insighty-vs-*.astro` is standalone — props are defined inline as JS objects at the top of the file (competitor strengths, gaps, checks). No shared template component is imported; the layout is self-contained HTML in each file.
