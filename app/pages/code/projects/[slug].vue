<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncData(`codeProject-${slug}`, () =>
  queryCollection("codeProjects").first(),
);

const project = computed(() =>
  data.value?.items?.find((item) => item.title === slug),
);
</script>

<template>
  <div>
    <div class="lg:hidden">
      <ULink
        to="/code/projects"
        class="text-preset-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
      >
        <i class="hn hn-arrow-left-solid" />
      </ULink>
    </div>
    <div v-if="project">
      <h1 class="uppercase">{{ project.title }}</h1>
      <p>{{ project.description }}</p>
    </div>
  </div>
</template>
