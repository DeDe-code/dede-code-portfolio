<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "about",
    to: "/about",
  },
  {
    label: "code",
    to: "https://github.com/DeDe-code",
    target: "_blank",
    icon: "uim-arrow-up-right",
  },
  {
    label: "acting",
    to: "/acting",
  },
  {
    label: "contact",
    to: "/contact",
  },
]);
</script>

<template>
  <UNavigationMenu orientation="vertical" :items="items" />
</template>
