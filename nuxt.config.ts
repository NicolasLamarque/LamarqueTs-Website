import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-20",
  components: true,

  // ✨ MODE SPA - Désactive SSR pour éliminer les timeouts serveur
  ssr: false,

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

  // ✨ Configuration Nitro OPTIMISÉE pour Vercel
  nitro: {
    preset: 'vercel',
    timing: true,
    
    // Cache intelligent des routes
    routeRules: {
      '/': { 
        swr: 3600,
        headers: {
          'Cache-Control': 'public, max-age=3600, must-revalidate'
        }
      },
      '/**': { 
        swr: 3600,
        headers: {
          'Cache-Control': 'public, max-age=3600, must-revalidate'
        }
      }
    },
    
    // Prérendu pour performance
    prerender: {
      crawlLinks: true,
      routes: ['/']
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
        { property: "og:title", content: "Lamarque TS - Services Psychosociaux" },
        { property: "og:description", content: "Services psychosociaux professionnels par un travailleur social membre de l'OTSTCFQ" },
        { property: "og:url", content: "https://lamarquets.com" },
        { property: "og:type", content: "website" },
        { name: "keywords", content: "travailleur social, OTSTCFQ, services psychosociaux, suivi individuel, homologation de mandat, Québec" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/favicon.png" },
        { rel: "apple-touch-icon", href: "https://5eqf1pkqjlprn7ya.public.blob.vercel-storage.com/favicon.png" }
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

  sitemap: {
    exclude: [
      "/dashboard/**",
      "/Dashboard",
      "/admin/**",
      "/api/**",
      "/auth/**",
      "/profile/**",
      "/settings/**",
      "/login",
      "/register",
      "/Calendrier",
      "/Evenements",
      "/Procedure",
    ],

    defaults: {
      changefreq: "weekly",
      priority: 0.8,
    },

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
    // Optimisation images
    format: ['webp'],
    quality: 85,
  },
});