export default defineAppConfig({
  ui: {
    // Global presets that override default Nuxt UI styles
    appHeader: {
      slots: {
        root: "min-h-[var(--min-height-app-header)] max-w-[90%] flex justify-between items-center mx-auto mt-spacing-200 px-4 uppercase border-4 border-black border-b-0",
        link: "px-2 py-1 text-preset-3 md:text-preset-2 lg:text-preset-1 text-red-500 transition-[font-size] duration-500 ease-in-out focus:black focus:outline-none",
      },
    },
    main: {
      base: "max-w-[90%] min-h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] flex-1 overflow-hidden mx-auto border-4 border-black",
    },
    footer: {
      slots: {
        root: "min-h-[var(--min-height-app-footer)] max-w-[90%] mx-auto",
        container:
          "!max-w-[100%] !sm:flex !sm:items-center !sm:justify-between !p-0",
        left: "hidden",
        center: "hidden",
        right: [
          "w-full !justify-end p-spacing-200 text-preset-6-mobile md:text-preset-5 lg:text-preset-4 transition-[font-size] duration-500 ease-in-out font-[900]",
          // "[&>p:first-child]:text-red-500",
        ],
      },
    },
  },
});
