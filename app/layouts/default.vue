<script setup lang="ts">
const { currentThemeClass } = useTheme();
</script>
<template>
  <UContainer :class="currentThemeClass">
    <AppHeader />
    <main class="w-full max-w-2xl mx-auto md:mx-0">
      <slot />
    </main>
  </UContainer>
</template>
