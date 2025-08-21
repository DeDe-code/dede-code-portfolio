export default defineAppConfig({
  ui: {
    // Global presets that override default Nuxt UI styles
    input: {
      slots: {
        base: "!bg-transparent !border-2 !border-[var(--theme-border-primary)] focus:!border-[#f1c40f] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !text-lg !p-4 !text-white placeholder:!text-gray-400",
      },
    },

    textarea: {
      slots: {
        base: "!bg-transparent !border-2 !border-[var(--theme-border-primary)] focus:!border-[#f1c40f] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !text-lg !p-4 !min-h-80 !text-white placeholder:!text-gray-400 resize-none",
      },
    },

    button: {
      variants: {
        variant: {
          solid:
            "!bg-transparent !border-2 !border-[var(--theme-border-primary)] !text-white hover:!bg-[#e0b007] focus:!border-[#f1c40f] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !p-4 !shadow-none",
        },
      },
    },

    formField: {
      slots: {
        label: "!text-xl !mb-2 !font-medium !text-white",
      },
    },

    navigationMenu: {
      slots: {
        link: "nav-item !px-0 !text-xl !text-white before:!bg-transparent hover:!bg-transparent hover:!text-[#f4acb7] !relative !transition-colors !duration-300",
      },
    },
  },
});
