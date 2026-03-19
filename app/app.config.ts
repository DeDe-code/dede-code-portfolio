export default defineAppConfig({
  ui: {
    // Global presets that override default Nuxt UI styles
    appHeader: {
      slots: {
        root: "min-h-[var(--min-height-app-header)] max-w-[90%] flex justify-between items-center mx-auto mt-spacing-100 px-spacing-200 uppercase border-4 border-black border-b-0",
        link: "py-1 px-spacing-100 text-preset-3 md:text-preset-2 lg:text-preset-1 text-red-500 transition-[font-size] duration-500 ease-in-out focus:black focus:outline-none",
      },
    },
    main: {
      base: "max-w-[90%] min-h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] flex-1 overflow-hidden mx-auto border-4 border-black",
    },
    contentSideMenu: {
      slots: {
        root: "sticky top-[var(--min-height-app-header)] overflow-hidden min-h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] flex flex-col items-center justify-center p-0 uppercase lg:w-[30.5%] lg:flex-shrink-0 lg:block lg:px-spacing-100 lg:pt-spacing-200 lg:px-spacing-200 lg:border-r-4 border-black",
      },
    },
    link: {
      base: "text-preset-3 md:text-preset-2 lg:text-preset-1 text-gray-700 transition-[font-size] duration-500 ease-in-out focus:black focus:outline-none",
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
