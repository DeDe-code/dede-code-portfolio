<script setup lang="ts">
const route = useRoute();
const isLoading = ref(route.path === "/");
</script>
<template>
  <div>
    <AnimationsLoadingScreen v-if="isLoading" @complete="isLoading = false" />
    <div v-show="!isLoading">
      <!-- <AppHeader /> -->
      <slot />
    </div>
  </div>
</template>
