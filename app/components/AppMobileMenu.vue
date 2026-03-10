<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { ref } from "vue";

const emit = defineEmits(["close-mobile-menu"]);

const handleLinkClick = () => {
  emit("close-mobile-menu");
};

const items = ref<NavigationMenuItem[]>([
  {
    label: "about",
    to: "/about",
  },
  {
    label: "code",
    to: "https://github.com/DeDe-code",
    target: "_blank",
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
    @click="handleLinkClick"
  />
</template>
