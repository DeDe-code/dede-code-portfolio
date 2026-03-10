<script setup lang="ts">
const { currentThemeClass } = useTheme();
const route = useRoute();
const isLoading = ref(route.path === "/");
</script>
<template>
  <UContainer :class="currentThemeClass">
    <AnimationsLoadingScreen v-if="isLoading" @complete="isLoading = false" />
    <AppHeader v-show="!isLoading" />
    <main v-show="!isLoading" class="max-w-2xl mx-auto md:mx-0">
      <slot />
    </main>
  </UContainer>
</template>
