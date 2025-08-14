<script setup lang="ts">
// import { useRoute } from "vue-router";
// const route = useRoute();
import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { ref } from "vue";

// Register GSAP plugins
gsap.registerPlugin(CSSPlugin);

const mobileMenuRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);

const toggleMobileMenu = () => {
  if (!mobileMenuRef.value) return;

  if (isMenuOpen.value) {
    // Close animation
    gsap.to(mobileMenuRef.value, {
      rotation: -90,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      transformOrigin: "top right",
      onComplete: () => {
        mobileMenuRef.value?.classList.add("hidden");
      },
    });
  } else {
    // Open animation
    mobileMenuRef.value?.classList.remove("hidden");
    gsap.to(mobileMenuRef.value, {
      rotation: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      transformOrigin: "top right",
    });
  }

  isMenuOpen.value = !isMenuOpen.value;
  return isMenuOpen.value;
};

const { currentThemeClass } = useTheme();
</script>

<template>
  <UContainer :class="currentThemeClass">
    <header class="header-grid themed-header mt-8 relative">
      <div class="header-content">
        <!-- <p class="text-xl text-white">{{ route.name }}</p> -->
        <ULink to="/about" class="themed-link block mb-4 text-4xl font-bold">
          dede-code
        </ULink>
      </div>
      <div class="header-menu-icon" @click="toggleMobileMenu">
        <UIcon name="uim:bars" class="lg:hidden text-4xl" />
      </div>

      <div class="header-picture">
        <NuxtImg
          src="/image/profile-picture.jpg"
          alt="Project 1 Preview"
          width="250"
          height="100"
          format="webp"
          loading="lazy"
          class="shadow-md hidden lg:block"
        />
      </div>

      <LayoutTopNavigation class="hidden lg:block" />
      <div
        ref="mobileMenuRef"
        class="mobile-menu fixed top-[5.7rem] right-[0.8rem] h-[calc(100vh-8rem)] z-50 rotate-[-90deg] hidden opacity-0 p-8 lg:hidden"
      >
        <LayoutMobileMenu @closeMobileMenu="toggleMobileMenu" />
      </div>
    </header>

    <main class="">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
  </UContainer>
</template>
