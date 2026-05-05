<script setup lang="ts">
const { ui } = useAppConfig();
const slots = ui.contetnSideDropdownMenu.slots;
const route = useRoute();

const props = defineProps<{
  selectMode?: boolean;
}>();

const emit = defineEmits<{
  select: [title: string];
}>();

const collectionName = computed(() => {
  // Route prefix changed from /theater to /acting
  if (route.path.startsWith("/acting/films")) return "theaterFilms";
  if (route.path.startsWith("/acting/theater")) return "theaterShows";
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
  // Base paths updated from /theater/... to /acting/...
  if (collectionName.value === "theaterShows") return "/acting/theater/";
  if (collectionName.value === "theaterFilms") return "/acting/films/";
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
    <template v-if="props.selectMode">
      <button
        v-for="item in items"
        :key="item.to"
        :class="slots.link"
        @click="emit('select', item.title)"
      >
        {{ item.title }}
      </button>
    </template>
    <template v-else>
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
    </template>
  </div>
</template>
