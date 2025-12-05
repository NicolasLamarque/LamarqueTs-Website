import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-20",
  components: true,

  // ✅ SSR activé (nécessaire pour API + SEO)
  ssr: true,

  devtools: {
    enabled: true,
  },

  future: {
    compatibilityVersion: 4,
  },

  imports: {
    autoImport: true,
  },

  dir: {
    middleware: "middleware",
    pages: "pages",
  },

  // ✅ Configuration Nitro OPTIMISÉE pour SEO + Performance
  nitro: {
    preset: 'vercel',
    timing: true,
    
    routeRules: {
      // ✅ PAGES PUBLIQUES - PRÉRENDUES (Google voit HTML statique)
      '/': { 
        prerender: true,
        swr: 3600,
        headers: {
          'Cache-Control': 'public, max-age=3600, must-revalidate',
          'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large'
        }
      },
      '/services': { 
        prerender: true,
        swr: 3600 
      },
      '/contact': { 
        prerender: true,
        swr: 3600 
      },
      '/about': { 
        prerender: true,
        swr: 3600 
      },
      '/Procedure': { 
        prerender: true,
        swr: 3600 
      },
      
      // ✅ Pages privées - Pas d'indexation
      '/dashboard/**': { 
        ssr: true,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      },
      '/login': { 
        ssr: false,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow'
        }
      },
      '/register': { 
        ssr: false,
        headers: {
          'X-Robots-Tag': 'noindex, nofollow'
        }
      },
      
      // ✅ API routes - Serveur actif + CORS
      '/api/**': { 
        cors: true,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': 'https://lamarquets.com',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      }
    },
    
    // ✅ PRÉRENDU au build - Pages statiques pour bots
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/services', 
        '/contact', 
        '/about', 
        '/Procedure'
      ],
      failOnError: false
    },
    
    // Compression
    compressPublicAssets: true,
  },

  app: {
    head: {
      title: "Lamarque TS - Services Psychosociaux",
      titleTemplate: "%s | Lamarque TS",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Services psychosociaux professionnels par un travailleur social membre de l'OTSTCFQ. Suivi individuel et homologation de mandat en protection.",
        },
        { name: "color-scheme", content: "dark light" },
        { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
        { property: "og:title", content: "Lamarque TS - Services Psychosociaux" },
        { property: "og:description", content: "Services psychosociaux professionnels par un travailleur social membre de l'OTSTCFQ" },
        { property: "og:url", content: "https://lamarquets.com" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fr_CA" },
        { name: "keywords", content: "travailleur social, OTSTCFQ, services psychosociaux, suivi individuel, homologation de mandat, Québec" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/favicon.png" },
        { rel: "apple-touch-icon", href: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/favicon.png" },
        { rel: "canonical", href: "https://lamarquets.com" }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Lamarque TS",
            "description": "Services psychosociaux professionnels par un travailleur social membre de l'OTSTCFQ. Suivi individuel et homologation de mandat.",
            "url": "https://lamarquets.com",
            "areaServed": {
              "@type": "State",
              "name": "Québec"
            },
            "serviceType": [
              "Services psychosociaux",
              "Suivi individuel",
              "Homologation de mandat"
            ],
            "provider": {
              "@type": "Person",
              "name": "Lamarque",
              "jobTitle": "Travailleur social",
              "memberOf": {
                "@type": "Organization",
                "name": "OTSTCFQ"
              }
            }
          })
        }
      ],
      htmlAttrs: {
        lang: 'fr-CA'
      }
    },
  },

  site: {
    url: "https://lamarquets.com",
    name: "Lamarque TS",
    description: "Services psychosociaux professionnels par un travailleur social membre de l'OTSTCFQ",
  },

  alias: {
    "~": fileURLToPath(new URL("./", import.meta.url)),
    "@": fileURLToPath(new URL("./", import.meta.url)),
    "#server": fileURLToPath(new URL("./server", import.meta.url)),
    "#server-src": fileURLToPath(new URL("./server/src", import.meta.url)),
  },

  vite: {
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./", import.meta.url)),
        "#server": fileURLToPath(new URL("./server", import.meta.url)),
        "#server-src": fileURLToPath(new URL("./server/src", import.meta.url)),
      },
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vesp/nuxt-fontawesome",
    "@nuxtjs/sitemap",
  ],

  // ✅ SITEMAP CONFIGURATION OPTIMISÉE
  sitemap: {
    // URL de base
    hostname: 'https://lamarquets.com',
    
    // Exclure les pages privées et inutiles
    exclude: [
      '/dashboard/**',
      '/admin/**',
      '/api/**',
      '/login',
      '/Calendrier',
      '/Evenements',
      '/credits',  // Page secondaire
      '/declaration-serment',  // Page très spécifique
    ],

    // Configuration par défaut pour toutes les URLs
    defaults: {
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString()
    },

    // URLs spécifiques avec priorités personnalisées
    urls: [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: '/mandat',
        changefreq: 'weekly',
        priority: 0.95  // Service principal
      },
      {
        loc: '/accompagnement',
        changefreq: 'weekly',
        priority: 0.9  // Service principal
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.85
      },
      {
        loc: '/groupe-homme',
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: '/Procedure',
        changefreq: 'monthly',
        priority: 0.7  // Guide utile pour SEO
      },
      {
        loc: '/blog',
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: '/politique-confidentialite',
        changefreq: 'yearly',
        priority: 0.3
      }
    ],

    // Génération automatique des lastmod
    autoLastmod: true,
  },

  fontawesome: {
    component: "font-awesome-icon",
    icons: {
      solid: [
        "cog",
        "calendar-check",
        "clock",
        "eye",
        "edit",
        "trash",
        "envelope",
        "external-link-alt",
        "location-dot",
        "phone",
        "pencil-alt",
        "user",
        "user-group",
        "user-circle",
        "users",
        "plus",
        "times",
        "search",
        "arrow-left",
        "arrow-right",
        "calendar-alt",
        "calendar-day",
        "chevron-left",
        "chevron-right",
        "bars",
        "times-circle",
        "info-circle",
        "check-circle",
        "exclamation-circle",
        "question-circle",
        "arrow-up",
        "arrow-down",
        "angle-left",
        "angle-right",
        "angle-up",
        "angle-down",
        "angle-double-left",
        "angle-double-right",
        "angle-double-up",
        "angle-double-down",
        "home",
        "sign-out-alt",
        "sign-in-alt",
        "xmark",
        "stethoscope",
        "user-doctor",
        "hospital",
        "procedures",
      ],
    },
  },

  image: {
    domains: ["5eqf1pkqjlprn7ya.public.blob.vercel-storage.com"],
    provider: "vercel",
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      custom350: 350,
      custom700: 700,
    },
    format: ['webp'],
    quality: 85,
  },
});