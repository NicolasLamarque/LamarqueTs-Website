
export default defineNuxtConfig({
  components: true,
  devtools: {
    enabled: true,
  },
  future: {
    compatibilityVersion: 4,
    
  },

  app: {
    head: {
      title: 'My Nuxt 3 Project',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A Nuxt 3 project with Tailwind CSS and Content module' },
        { name: 'color-scheme', content: 'dark light' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  modules: [// Content module for managing content
  // Tailwind CSS module for styling
  '@nuxt/content',
  '@nuxtjs/tailwindcss', 
  '@nuxt/image', 
  '@vesp/nuxt-fontawesome'],

  fontawesome: {
    icons: {
      solid: ['cog', 'calendar-check', 'clock', 'eye', 'edit', 'trash','envelope', 'external-link-alt', 'location-dot', 'phone'],
    
    }
  }
 
})