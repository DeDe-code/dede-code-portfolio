// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
 

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
      { name: 'JetBrains Mono', provider: 'google' },
    ]
  }
  ,
});
