<script setup lang="ts">
// const route = useRoute();
const { ui } = useAppConfig();
const slots = ui.appHeader.slots;
const links = [
  { label: "home", to: "/" },
  {
    label: "code",
    to: "/code",
  },
  {
    label: "theater",
    to: "/theater",
  },
  {
    label: "about",
    to: "/about",
  },
];
</script>

<template>
  <header :class="slots.root">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      :class="slots.link"
      active-class="!text-white-50 bg-black"
      exact-active-class="!text-white-50 bg-black"
      >{{ link.label }}</NuxtLink
    >
  </header>
</template>
