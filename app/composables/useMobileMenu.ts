import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { watchEffect, ref, onUnmounted } from "vue";
import type { Ref } from "vue";
import { useWindowSize } from "./useWindowsSize";

interface UseMobileMenuReturn {
  toggleMobileMenu: () => boolean | undefined;
  mobileMenuRef: Ref<HTMLElement | null>;
  isMenuOpen: Ref<boolean>;
}

export const useMobileMenu = (): UseMobileMenuReturn => {
  // Register GSAP plugins
  gsap.registerPlugin(CSSPlugin);

  const { isDesktop } = useWindowSize();

  const mobileMenuRef = ref<HTMLElement | null>(null);
  const isMenuOpen = ref(false);

  // Store active animations for cleanup
  let activeAnimation: gsap.core.Tween | null = null;

  const toggleMobileMenu = () => {
    const menu = mobileMenuRef.value;
    if (!menu) return;

    // Kill any existing animation
    if (activeAnimation) {
      activeAnimation.kill();
      activeAnimation = null;
    }

    if (isMenuOpen.value) {
      // Close animation
      activeAnimation = gsap.to(menu, {
        rotation: -90,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
        transformOrigin: "top right",
        onComplete: () => {
          menu?.classList.add("hidden");
          activeAnimation = null;
        },
      });
    } else {
      // Open animation
      menu?.classList.remove("hidden");
      activeAnimation = gsap.to(menu, {
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "top right",
        onComplete: () => {
          activeAnimation = null;
        },
      });
    }

    isMenuOpen.value = !isMenuOpen.value;
    return isMenuOpen.value;
  };

  const stopWatcher = watchEffect(() => {
    if (isDesktop.value && isMenuOpen.value) {
      toggleMobileMenu();
    }
  });

  onUnmounted(() => {
    // Kill any existing animation
    if (activeAnimation) {
      activeAnimation.kill();
      activeAnimation = null;
    }
    // Cleanup watcher
    stopWatcher();
  });

  return {
    toggleMobileMenu,
    mobileMenuRef,
    isMenuOpen,
  };
};
