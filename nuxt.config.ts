// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Configure page transitions
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    layoutTransition: {
      name: "layout", 
      mode: "out-in",
    },
  },

  // Ensure transitions are enabled
  experimental: {
    viewTransition: true,
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@nuxt/fonts",
  ],

  css: [
    "~/assets/css/main.css", // The ~ points to app/ folder
  ],

  fonts: {
    families: [
      // Google Fonts
      { name: "JetBrains Mono", provider: "google" },
    ],
  },
});
