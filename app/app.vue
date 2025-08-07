<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <UContainer class="">
    <header class="header-grid border-b-2 border-white">
      <div class="header-content">
        <p>{{ route.name }}</p>
        <ULink to="/" class="block mb-4 text-2xl font-bold text-white">
          dede-code
        </ULink>
      </div>

      <div class="header-picture">
        <NuxtImg
          src="/image/profile-picture-test.jpg"
          alt="Project 1 Preview"
          width="250"
          height="100"
          format="webp"
          loading="lazy"
          class="rounded-lg shadow-md"
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
