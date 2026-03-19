<script setup lang="ts">
const { ui } = useAppConfig();
const slots = ui.contentSideMenu.slots;
const codeItems = [
  { label: "skills", to: "/code/skills" },
  { label: "projects", to: "/code/projects" },
];
const theaterItems = [
  { label: "theater", to: "/theater/theater" },
  { label: "films", to: "/theater/films" },
];
const menuItems = computed(() => {
  const route = useRoute();
  if (route.path.startsWith("/code")) {
    return codeItems;
  } else if (route.path.startsWith("/theater")) {
    return theaterItems;
  } else {
    return [];
  }
});
</script>

<template>
  <div :class="slots.root">
    <ULink
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      class="block py-2 text-gray-700 hover:bg-gray-100"
      active-class="bg-gray-200 font-bold"
      exact-active-class="bg-gray-200 font-bold"
      >{{ item.label }}</ULink
    >
  </div>
</template>
