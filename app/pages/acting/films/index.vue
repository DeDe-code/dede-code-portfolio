<script setup lang="ts">
import type { ShowImage } from "~/components/theater/ShowImageViewer.vue";

const { data } = await useAsyncData("theaterFilmsIndex", () =>
  queryCollection("theaterFilms").first(),
);

const allImages = computed<ShowImage[]>(() => {
  if (!data.value?.items) return [];
  return data.value.items.flatMap((film) =>
    useFilmImages(film.title, film.imageCount).map((src) => ({
      src,
      year: "",
      title: film.title,
      role: film.description ?? "",
      director: "",
    })),
  );
});

const viewerOpen = ref(false);
const viewerImages = ref<ShowImage[]>([]);
const viewerStartIndex = ref(0);

function openViewerByTitle(title: string) {
  viewerImages.value = allImages.value.filter((i) => i.title === title);
  viewerStartIndex.value = 0;
  viewerOpen.value = true;
}
</script>

<template>
  <div>
    <!-- Mobile (< lg): back link to acting index + sub-section dropdown -->
    <div class="lg:hidden">
      <ULink
        to="/acting"
        class="text-preset-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
      >
        <i class="hn hn-arrow-left-solid" />
      </ULink>
      <ContentSideDropdownMenu
        :select-mode="true"
        @select="openViewerByTitle"
      />
    </div>
    <h1 class="hidden lg:block">Welcome to the films page!</h1>

    <TheaterShowImageViewer
      :open="viewerOpen"
      :images="viewerImages"
      :start-index="viewerStartIndex"
      @close="viewerOpen = false"
    />
  </div>
</template>
