<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { ref } from "vue";

const emit = defineEmits(["closeMobileMenu"]);

const handleLinkClick = () => {
  emit("closeMobileMenu");
};

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
    class="themed-navigation data-[orientation=vertical]:w-38 hover:none"
    :ui="{
      link: 'nav-item px-0 text-xl text-white before:!bg-transparent hover:!bg-transparent hover:text-[#f4acb7] relative',
    }"
    @click="handleLinkClick"
  />
</template>
