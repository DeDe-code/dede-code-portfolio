// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  pages: true,

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

  // Configure image optimization
  image: {
    provider: "cloudinary",
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`,
      modifiers: {
        format: "auto",
        quality: "auto",
      },
    },
  },

  css: [
    "~/assets/css/main.css", // The ~ points to app/ folder
  ],

  fonts: {
    families: [
      // Google Fonts
      { name: "JetBrains Mono", provider: "google" },
    ],
  },

  imports: {
    dirs: ["composables/animations"],
  },

  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit", "gsap"],
    },
  },

  // Permanent redirects for the /theater → /acting rename.
  // Any bookmark or external link to the old routes stays functional.
  routeRules: {
    "/theater": { redirect: { to: "/acting", statusCode: 301 } },
    "/theater/theater": {
      redirect: { to: "/acting/theater", statusCode: 301 },
    },
    "/theater/theater/**": {
      redirect: { to: "/acting/theater/:splat", statusCode: 301 },
    },
    "/theater/films": { redirect: { to: "/acting/films", statusCode: 301 } },
    "/theater/films/**": {
      redirect: { to: "/acting/films/:splat", statusCode: 301 },
    },
  },
});
