export default defineAppConfig({
  ui: {
    // Global presets that override default Nuxt UI styles
    main: {
      base: "max-w-[90%] h-[100px] overflow-hidden mx-auto border-4 border-gray-500",
    },
    header: {
      slots: {
        root: "max-w-[90%] mx-auto !px-0 border-2 border-blue-500",
        container: "max-w-[100%] mx-auto !px-0 !sm:px-0 !lg:px-0",
        left: "hidden !flex-none !w-0",
        right: "hidden !flex-none !w-0",
        center: "w-full max-w-[100%] flex justify-between border-2",
      },
    },
  },
});
