<script setup lang="ts">
const { toggleMobileMenu, mobileMenuRef } = useMobileMenu();
</script>
<template>
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

    <AppNavigation class="hidden lg:block" />
    <div
      ref="mobileMenuRef"
      class="mobile-menu fixed top-[5.7rem] right-0 h-[calc(100vh-8rem)] z-50 rotate-[-90deg] hidden opacity-0 p-8 bg-[#1a1a1a] lg:hidden"
    >
      <AppMobileMenu @closeMobileMenu="toggleMobileMenu" />
    </div>
  </header>
</template>
