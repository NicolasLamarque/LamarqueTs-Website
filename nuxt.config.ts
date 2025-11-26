import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-20",
  components: true,

  devtools: {
    enabled: true,
  },

  future: {
    compatibilityVersion: 4,
  },

  // ✅ AJOUT : Force les auto-imports pour les middlewares
  imports: {
    autoImport: true,
  },

  dir: {
    middleware: "middleware",
    pages: "pages",
  },

  app: {
    head: {
      title: "My Nuxt 3 Project",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "A Nuxt 3 project with Tailwind CSS and Content module",
        },
        { name: "color-scheme", content: "dark light" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // ✅ NOUVEAU : Configuration du site
  site: {
    url: "https://lamarquets.com", // ⚠️ Remplace par ton vrai domaine
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
    "@nuxtjs/tailwindcss", // module tailwindcss
    "@nuxt/image", // module image
    "@vesp/nuxt-fontawesome", // module fontawesome
    "@nuxtjs/sitemap", // module sitemap
  ],

  //  Configuration du sitemap
  sitemap: {
    // Exclure les pages du dashboard et admin
    exclude: [
      "/dashboard/**",  // Exclure toutes les URLs commencant par "/dashboard/"
      "/Dashboard", // Exclure la page Dashboard principale
      "/admin/**", // Exclure toutes les URLs commencant par "/admin/"
      "/api/**", // Exclure les routes API
      "/auth/**", // Exclure les routes d'authentification
      "/profile/**", // Exclure les pages de profil utilisateur
      "/settings/**", // Exclure les pages de configuration utilisateur
      "/login",   // Exclure la page de login
      "/register", // Exclure la page d'inscription
      "/Calendrier",  // Exclure la page Calendrier
      "/Evenements", // Exclure la page Evenements
      "/Groupe-Homme", // Exclure la page Groupe Homme
      "/Procedure", // Exclure la page Procedure
      "/Contact-Page", // Exclure la page Contact
      "/blog*", // Exclure les pages de blog
    ],

    // Configuration par défaut pour toutes les URLs
    defaults: {
      changefreq: "weekly",
      priority: 0.8,
    },

    // Détection automatique des routes publiques
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
        "faStethoscope",
        "faUserDoctor",
        "faHospital",
        "faProcedures",
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
  },
});
