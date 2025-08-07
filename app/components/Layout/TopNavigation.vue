<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "about",
    to: "/",
  },
  {
    label: "code",
    to: "/Code",
  },
  {
    label: "acting",
    to: "/Acting",
  },
  {
    label: "contact",
    to: "/Contact",
  },
]);
</script>

<template>
  <UNavigationMenu
    orientation="vertical"
    :items="items"
    class="data-[orientation=vertical]:w-38 border-l-2 border-white hover:none side-nav"
    :ui="{
      link: 'px-0 text-white before:!bg-transparent hover:!bg-transparent hover:text-green-500',
    }"
  />
</template>
