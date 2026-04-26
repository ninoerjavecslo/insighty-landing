import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { postSchema } from './src/schemas/post'

export default defineConfig({
  name: 'insighty-blog',
  title: 'Insighty Blog',

  projectId: 'er6273w8',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: [postSchema],
  },
})
