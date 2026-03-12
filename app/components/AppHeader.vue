<script setup lang="ts">
// const route = useRoute();
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
  <header
    class="max-w-[90%] flex justify-between mx-auto p-[var(--spacing-spacing-100)] uppercase border-4 border-gray-500 border-b-0"
  >
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="px-2 py-1 text-preset-3 md:text-preset-2 lg:text-preset-1 text-red-500 transition-[font-size] duration-500 ease-in-out focus:text-gray-500 focus:outline-none"
      active-class="!text-white-50 bg-gray-500"
      exact-active-class="!text-white-50 bg-gray-500"
      >{{ link.label }}</NuxtLink
    >
  </header>
</template>
