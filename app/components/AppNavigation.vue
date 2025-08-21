<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "about",
    to: "/about",
  },
  {
    label: "code",
    to: "/code",
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
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    class="themed-navigation data-[orientation=vertical]:w-38 hover:none side-nav"
  />
</template>
