import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-20",
  components: true,

  // ✅ SSR ACTIVÉ - ESSENTIEL
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

  // Configuration Nitro SIMPLE qui marche
  nitro: {
    preset: 'vercel',
    // ✨ AJOUTEZ CECI:
  prerender: {
    routes: ['/'],
    crawlLinks: false
  },
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
    // AVEC le www — c'est l'adresse reelle du site.
    //
    // Sans lui, le plan du site annoncait a Google neuf adresses en
    // lamarquets.com qui redirigent TOUTES vers www.lamarquets.com. Google
    // recevait donc une carte entierement composee de redirections, ce qui
    // dilue les signaux et retarde l'indexation. C'est aussi cette valeur qui
    // sert de base aux balises canoniques.
    url: "https://www.lamarquets.com",
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

  // SITEMAP SIMPLE
  sitemap: {
    autoLastmod: true,

    // La page d'accueil est declaree explicitement.
    //
    // Elle est prerendue (voir nitro.prerender ci-dessus), donc servie comme
    // fichier statique — et elle n'apparaissait pas dans le plan genere en
    // production, alors que c'est la page la plus importante du site. On ne
    // laisse pas ce hasard decider : priorite 1, la valeur maximale.
    urls: [
      { loc: "/", changefreq: "weekly", priority: 1.0 },
    ],

    // Pages retirees du plan du site.
    //
    // Elles y figuraient alors que robots.txt les interdit deja : deux
    // signaux contradictoires envoyes a Google, qui les signale comme
    // erreurs dans la Search Console.
    //
    //   /dashboard, /login  : inutile d'indiquer publiquement ou se trouve
    //                         l'administration. Les deux sont protegees,
    //                         mais autant ne pas les mettre sur une carte.
    //   /Calendrier         : la page est vide, son template ne contient
    //                         rien. Indexee, elle penalise le referencement.
    //   /Evenements         : le calendrier n'est pas encore ouvert au
    //                         public et n'est lie nulle part.
    exclude: [
      "/dashboard",
      "/dashboard/**",
      "/login",
      "/Calendrier",
      "/Evenements",
    ],

    defaults: {
      changefreq: "weekly",
      priority: 0.8,
    },
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
        "file-pdf",  // AJOUTÉ pour éviter l'erreur
      ],
    },
  },

  image: {
    domains: ["5eqf1pkqjlprn7ya.public.blob.vercel-storage.com"],
    provider: "vercel",
    // Largeurs autorisées pour l'optimiseur d'images.
    //
    // ATTENTION : ce n'est pas une simple liste de breakpoints. Toute
    // largeur demandée par un composant qui ne figure PAS ici est arrondie
    // vers le HAUT jusqu'à la valeur suivante. Une vignette de 300 px était
    // ainsi servie en 320, une image de 400 px en 640, et le logo — qui ne
    // déclarait aucune largeur — partait carrément en 1536 px sur chaque
    // page. D'où les valeurs fines ajoutées ci-dessous.
    screens: {
      // Tailles fines, pour les logos et les vignettes
      logo: 64,
      logo2x: 128,
      logo4x: 256,
      thumb: 300,
      thumb2x: 600,
      card: 400,
      card2x: 800,

      // Breakpoints classiques
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