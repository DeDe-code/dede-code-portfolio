<script setup lang="ts">
const route = useRoute();
const isSubPage = computed(() => route.path !== "/theater");
</script>

<template>
  <div class="lg:flex">
    <ContentSideMenu :class="isSubPage ? 'hidden lg:block' : 'block'" />
    <div
      class="flex-1 min-w-0"
      :class="isSubPage ? 'block' : 'hidden lg:block'"
    >
      <NuxtPage />
    </div>
  </div>
</template>
