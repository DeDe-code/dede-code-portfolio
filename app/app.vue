<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const { currentThemeClass } = useTheme();
</script>

<template>
  <UContainer :class="currentThemeClass">
    <header class="header-grid themed-header mt-8">
      <div class="header-content">
        <p>{{ route.name }}</p>
        <ULink to="/" class="block mb-4 text-2xl font-bold text-white">
          dede-code
        </ULink>
      </div>

      <div class="header-picture">
        <NuxtImg
          src="/image/profile-picture.jpg"
          alt="Project 1 Preview"
          width="250"
          height="100"
          format="webp"
          loading="lazy"
          class="shadow-md"
        />
      </div>

      <LayoutTopNavigation />
    </header>

    <main class="">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
  </UContainer>
</template>
