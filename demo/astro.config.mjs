// @ts-check
import preact from '@astrojs/preact'
import react from '@astrojs/react'
import solidJs from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({ include: '**/*.react.{jsx,tsx}' }),
    preact({ include: '**/*.preact.{jsx,tsx}' }),
    solidJs({ include: '**/*.solid.{jsx,tsx}' }),
    vue({
      include: ['**/*.vue.{jsx,tsx}', '**/*.vue'],
      // jsx: true, //? broken
    }),
    svelte(),
  ],
  site: 'https://valooford.github.io/astro-context/',
  base: '/astro-context',
})
