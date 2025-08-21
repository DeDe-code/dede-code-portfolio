// composables/useWindowSize.ts
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

interface UseWindowSizeReturn {
  windowWidth: Ref<number>;
  windowHeight: Ref<number>;
  isMobile: Ref<boolean>;
  isTablet: Ref<boolean>;
  isDesktop: Ref<boolean>;
  isLarge: Ref<boolean>;
  isAboveBreakpoint: (breakpoint: string) => Ref<boolean>;
}

export const useWindowSize = (): UseWindowSizeReturn => {
  const windowWidth = ref(0);
  const windowHeight = ref(0);

  const handleResize = () => {
    if (typeof window !== "undefined") {
      windowWidth.value = window.innerWidth;
      windowHeight.value = window.innerHeight;
    }
  };

  onMounted(() => {
    handleResize(); // Set initial values
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
    }
  });

  // Breakpoint utilities
  const isMobile = computed(() => windowWidth.value < 768);
  const isTablet = computed(
    () => windowWidth.value >= 768 && windowWidth.value < 1024
  );
  const isDesktop = computed(() => windowWidth.value >= 1024);
  const isLarge = computed(() => windowWidth.value >= 1280);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const isAboveBreakpoint = (breakpoint: string) => {
    return computed(() => {
      const bp = breakpoints[breakpoint as keyof typeof breakpoints];
      return bp ? windowWidth.value >= bp : false;
    });
  };

  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    isAboveBreakpoint,
  };
};
