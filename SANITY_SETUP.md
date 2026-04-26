# Sanity CMS Setup Guide

This project uses Sanity as the CMS for the blog. Follow these steps to connect your Sanity project.

## 1. Create a Sanity account

Go to [sanity.io](https://sanity.io) and create a free account.

## 2. Create a new Sanity project

Run the following in the project root:

```bash
npx sanity@latest init
```

During the wizard:
- Choose **"Create new project"**
- Name it `Insighty Blog`
- Choose **`production`** as the dataset name
- When asked about a schema, choose **"Clean project with no predefined schemas"** (we already have schemas in `src/schemas/post.ts`)

This will give you a `projectId` (e.g. `abc1234x`).

## 3. Add credentials to your .env file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
PUBLIC_SANITY_PROJECT_ID=abc1234x        # your actual project ID
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-read-token         # optional, for private datasets
```

**Also set these in your hosting provider** (Netlify, Vercel, etc.) as environment variables for production builds.

## 4. Deploy the Sanity Studio

The Sanity Studio is a browser-based editor where you write and publish posts. Deploy it with:

```bash
npx sanity@latest deploy
```

You'll be asked to choose a hostname (e.g. `insighty`). Your studio will be live at:
`https://insighty.sanity.studio/`

### Installing the Sanity CLI (optional but recommended)

```bash
npm install -g sanity@latest
```

## 5. Add your post schema to the Studio

The schema is already defined in `src/schemas/post.ts`. Reference it in your Sanity project's `sanity.config.ts` at the root of this repo — this file is pre-configured.

After deploying, visit your studio URL and you should see the **Blog Post** document type.

## 6. Import existing blog content (optional)

If you have existing Markdown posts in `src/content/blog/` that you want to migrate to Sanity, you can use the [sanity-migrate](https://www.sanity.io/plugins/sanity-migrate) tool or write a custom import script.

**Example: create a single post via CLI**

```bash
npx sanity@latest documents create --project <your-project-id> --dataset production << 'EOF'
{
  "_type": "post",
  "title": "Your Post Title",
  "slug": { "_type": "slug", "current": "your-post-title" },
  "description": "Post description here.",
  "pubDate": "2024-01-15T00:00:00.000Z",
  "category": "Agency Ops",
  "readTime": 5,
  "featured": false
}
EOF
```

## 7. Set up a Netlify build hook (for automatic deploys on publish)

So the site rebuilds when you publish a post in Sanity:

1. In **Netlify** → Site settings → Build & deploy → Build hooks → **Add build hook**
   - Name: `Sanity publish`
   - Copy the webhook URL

2. In **Sanity Studio** → [manage.sanity.io](https://manage.sanity.io) → your project → API → Webhooks → **Add webhook**
   - Name: `Netlify rebuild`
   - URL: paste the Netlify build hook URL
   - Dataset: `production`
   - Trigger on: **Publish** (and optionally Unpublish)
   - Filter: `_type == "post"`

Now every time you publish a post in the Studio, Netlify will automatically rebuild and deploy the site.

## File structure overview

```
src/
  lib/
    sanity.ts          — Sanity client + GROQ queries + safeFetch helper
    portable-text.ts   — Portable Text → HTML renderer (uses @portabletext/to-html)
  schemas/
    post.ts            — Sanity document schema for blog posts
sanity.config.ts       — Sanity Studio configuration (used by `sanity deploy`)
.env.example           — Environment variable template
```

## Troubleshooting

**Build fails with "projectId must be a string"**
Make sure `PUBLIC_SANITY_PROJECT_ID` is set in your `.env` file.

**Blog shows no posts**
Verify your Sanity project has posts in the `production` dataset, and that your env vars are correct.

**Images don't load**
Make sure CORS is configured in your Sanity project settings to allow requests from `https://insighty.io`.
