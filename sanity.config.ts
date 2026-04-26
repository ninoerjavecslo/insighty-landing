import { defineConfig } from 'sanity'
import { structuredContent } from 'sanity/structure'
import { postSchema } from './src/schemas/post'

// This config is used for the Sanity Studio (deployed separately via `sanity deploy`)
// The studio lives at https://your-project.sanity.studio/
// See SANITY_SETUP.md for setup instructions

export default defineConfig({
  name: 'insighty-blog',
  title: 'Insighty Blog',

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [structuredContent()],

  schema: {
    types: [postSchema],
  },
})
