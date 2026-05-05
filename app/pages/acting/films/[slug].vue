<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncData(`theaterFilm-${slug}`, () =>
  queryCollection("theaterFilms").first(),
);

const film = computed(() =>
  data.value?.items?.find((item) => item.title === slug),
);

const _images = computed(() =>
  film.value ? useFilmImages(film.value.title, film.value.imageCount) : [],
);
</script>

<template>
  <div>
    <!-- Mobile (< lg): back link to acting/films index -->
    <div class="lg:hidden">
      <ULink
        to="/acting/films"
        class="text-preset-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
      >
        <i class="hn hn-arrow-left-solid" />
      </ULink>
    </div>
    <div v-if="film">
      <h1 class="uppercase">{{ film.title }}</h1>
      <p>{{ film.description }}</p>
    </div>
  </div>
</template>
