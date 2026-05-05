<script setup lang="ts">
const route = useRoute();
// Detect whether we are on a sub-page (e.g. /acting/theater or /acting/films)
// vs the Acting index itself (/acting)
const isSubPage = computed(() => route.path !== "/acting");
</script>

<template>
  <div class="lg:flex">
    <!--
      ContentSideMenu visibility rules:
      - Under lg (mobile/tablet): shown on index, hidden on sub-pages
        (mobile uses NuxtPage to display sub-page content)
      - lg and above: ALWAYS hidden — content is fetched directly in acting/index.vue
      Previously used 'hidden lg:block' on sub-pages; now 'hidden' keeps it off on desktop too.
    -->
    <ContentSideMenu :class="isSubPage ? 'hidden' : 'block lg:hidden'" />

    <div
      class="flex-1 min-w-0"
      :class="isSubPage ? 'block' : 'hidden lg:block'"
    >
      <!--
      Main content area:
      - Sub-page: always visible (mobile navigated here via back/menu)
      - Acting index: hidden on mobile (side menu shown instead),
        visible on lg+ (acting/index.vue renders the direct gallery)
    -->
      <NuxtPage />
    </div>
  </div>
</template>
