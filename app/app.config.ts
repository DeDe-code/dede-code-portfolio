export default defineAppConfig({
  ui: {
    // Global presets that override default Nuxt UI styles
    alert: {
      slots: {
        root: "!fixed top-0 left-0 !z-1000 !w-full !h-screen !flex !items-center !justify-center rounded-none",
        // title: "!w-50 !font-semibold mx-auto",
        description: "!w-xl !mx-auto !text-base text-center ",
      },
      variants: {
        color: {
          success: {
            root: "!bg-green-500/80 !border-green-500",
            title: "!text-green-800",
            description: "!text-green-700",
          },
          customError: {
            root: "!bg-black/80",
            // title: "!bg-red-400 !text-black", // Light red that's visible on black
            description: "!p-8 !bg-red-400 !text-black", // Even lighter red
          },
        },
      },
    },
    input: {
      slots: {
        base: "!bg-transparent !border-2 !border-[var(--theme-border-primary)] focus:!border-[var(--color-focus)] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !text-lg !p-4 !text-white placeholder:!text-gray-400",
      },
    },

    textarea: {
      slots: {
        base: "!bg-transparent !border-2 !border-[var(--theme-border-primary)] focus:!border-[var(--color-focus)] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !text-lg !p-4 !min-h-80 !text-white placeholder:!text-gray-400 resize-none",
      },
    },

    button: {
      variants: {
        variant: {
          solid:
            "!bg-transparent !border-2 !border-[var(--theme-border-primary)] !text-white hover:!bg-[var(--color-focus-hover)] focus:!border-[var(--color-focus)] focus:!outline-none focus:!ring-0 !transition-all !duration-300 !p-4 !shadow-none",
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
        root: "side-nav themed-navigation !absolute !top-0 !right-0 !h-screen !w-[255px] !min-w-[255px] !max-w-[255px] !pt-[1.3rem] lg:!pt-[10.2rem] !px-4 !z-[1000] bg-[var(--color-dark-background)] lg:bg-transparent",
        link: "nav-item !px-0 !text-xl !text-white before:!bg-transparent hover:!bg-transparent hover:!text-[var(--color-hover-accent)] !transition-colors !duration-300",
      },
    },
  },
  // Custom notification configuration
  notification: {
    base: "fixed inset-0 z-1000 flex items-center justify-center w-full bg-black/80",
    overlay: "bg-black/80",
    container:
      "flex justify-center items-center w-lg h-34 max-w-lg p-8 rounded-lg text-center ",
    variants: {
      error: {
        container:
          "bg-[var(--color-error-bg)] text-white border-2 border-[var(--color-error-border)]",
        icon: "text-red-200",
      },
      success: {
        container:
          "bg-[var(--color-teal)] text-white border-2 border-[var(--color-success-border)]",
        icon: "text-green-200",
      },
      loading: {
        container:
          "bg-[var(--color-teal)] text-white border-2 border-[var(--color-success-border)]",
        icon: "text-green-200",
      },
    },
  },
});
