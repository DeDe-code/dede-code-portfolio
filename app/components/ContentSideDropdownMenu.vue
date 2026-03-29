<script setup lang="ts">
const { ui } = useAppConfig();
const slots = ui.contetnSideDropdownMenu.slots;
const route = useRoute();

const collectionName = computed(() => {
  if (route.path.startsWith("/theater/films")) return "theaterFilms";
  if (route.path.startsWith("/theater/theater")) return "theaterShows";
  if (route.path.startsWith("/code/projects")) return "codeProjects";
  return null;
});

const { data } = useAsyncData(
  () => `dropdownItems-${collectionName.value}`,
  () => {
    if (!collectionName.value) return Promise.resolve(null);
    return queryCollection(
      collectionName.value as "codeProjects" | "theaterShows" | "theaterFilms",
    ).first();
  },
  { watch: [collectionName] },
);

const basePath = computed(() => {
  if (collectionName.value === "codeProjects") return "/code/projects/";
  if (collectionName.value === "theaterShows") return "/theater/theater/";
  if (collectionName.value === "theaterFilms") return "/theater/films/";
  return "/";
});

const items = computed(
  () =>
    data.value?.items?.map((item) => ({
      title: item.title,
      to: `${basePath.value}${item.title}`,
    })) ?? [],
);
</script>

<template>
  <div :class="slots.root">
    <ULink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :class="slots.link"
      active-class="bg-gray-200 font-bold"
      exact-active-class="bg-gray-200 font-bold"
    >
      {{ item.title }}
    </ULink>
  </div>
</template>
