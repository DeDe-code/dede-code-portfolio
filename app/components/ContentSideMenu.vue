<script setup lang="ts">
const { ui } = useAppConfig();
const slots = ui.contentSideMenu.slots;
const route = useRoute();
const codeItems = [
  { label: "skills", to: "/code/skills" },
  { label: "projects", to: "/code/projects" },
];
const theaterItems = [
  { label: "theater", to: "/theater/theater" },
  { label: "films", to: "/theater/films" },
];
const menuItems = computed(() => {
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
    <template v-for="item in menuItems" :key="item.to">
      <ULink
        :to="item.to"
        :class="slots.link"
        active-class="bg-gray-200 font-bold"
        exact-active-class="bg-gray-200 font-bold"
        >{{ item.label }}</ULink
      >
      <ContentSideDropdownMenu v-if="route.path.startsWith(item.to)" />
    </template>
  </div>
</template>
