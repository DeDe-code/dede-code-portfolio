<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncData(`theaterShow-${slug}`, () =>
  queryCollection("theaterShows").first(),
);

const show = computed(() =>
  data.value?.items?.find((item) => item.title === slug),
);

const images = computed(() =>
  show.value ? useShowImages(show.value.title, show.value.imageCount) : [],
);
</script>

<template>
  <div>
    <div class="lg:hidden">
      <ULink
        to="/theater/theater"
        class="text-preset-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
      >
        <i class="hn hn-arrow-left-solid" />
      </ULink>
    </div>
    <div v-if="show">
      <h1 class="uppercase">{{ show.title }}</h1>
      <div v-for="image in images" :key="image">
        <NuxtImg :src="image" alt="" />
      </div>
    </div>
  </div>
</template>
