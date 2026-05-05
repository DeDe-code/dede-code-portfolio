<script setup lang="ts">
import type { ShowImage } from "~/components/theater/ShowImageViewer.vue";

// ── Data fetching ────────────────────────────────────────────────────────────
// Fetch all theater shows and films for the direct lg+ gallery.
// These queries only run their logic on the client/server once; the results
// are identical to what acting/theater/index.vue and acting/films/[slug].vue use.

const { data: showsData } = await useAsyncData("actingIndexShows", () =>
  queryCollection("theaterShows").first(),
);

const { data: filmsData } = await useAsyncData("actingIndexFilms", () =>
  queryCollection("theaterFilms").first(),
);

// ── Image lists ──────────────────────────────────────────────────────────────
// Build ShowImage[] from theater shows (year, title, role, director available)
const allShowImages = computed<ShowImage[]>(() => {
  if (!showsData.value?.items) return [];
  return showsData.value.items.flatMap((show) =>
    useShowImages(show.title, show.imageCount).map((src) => ({
      src,
      year: show.year,
      title: show.title,
      role: show.role,
      director: show.director,
    })),
  );
});

// Build ShowImage[] from films (no year/role/director in schema — use empty strings)
const allFilmImages = computed<ShowImage[]>(() => {
  if (!filmsData.value?.items) return [];
  return filmsData.value.items.flatMap((film) =>
    useFilmImages(film.title, film.imageCount).map((src) => ({
      src,
      year: "",
      title: film.title,
      role: "",
      director: "",
    })),
  );
});

// All acting media: shows first, then films
const allImages = computed<ShowImage[]>(() => [
  ...allShowImages.value,
  ...allFilmImages.value,
]);

// ── Staggered reveal ─────────────────────────────────────────────────────────
const displayedImages = ref<ShowImage[]>([]);
const revealed = ref(false);
const hoveredYear = ref<string | null>(null);

function revealImagesStaggered() {
  if (revealed.value) return;
  revealed.value = true;
  displayedImages.value = [];
  if (!allImages.value.length) return;
  const totalDuration = 800;
  const step = totalDuration / allImages.value.length;
  allImages.value.forEach((img, i) => {
    setTimeout(() => {
      displayedImages.value.push(img);
    }, i * step);
  });
}

onMounted(() => {
  // Trigger after page transition finishes; fall back after 600 ms
  const handler = () => {
    revealImagesStaggered();
    window.removeEventListener("page:transition:finish", handler);
  };
  window.addEventListener("page:transition:finish", handler);
  setTimeout(revealImagesStaggered, 600);
});

// ── Viewer ───────────────────────────────────────────────────────────────────
const viewerOpen = ref(false);
const viewerImages = ref<ShowImage[]>([]);
const viewerStartIndex = ref(0);

function openViewer(img: ShowImage) {
  // Group by year for shows; group by title for films (no year field)
  viewerImages.value = img.year
    ? allImages.value.filter((i) => i.year === img.year)
    : allImages.value.filter((i) => i.title === img.title);
  const idx = viewerImages.value.findIndex((i) => i.src === img.src);
  viewerStartIndex.value = idx < 0 ? 0 : idx;
  viewerOpen.value = true;
}
</script>

<template>
  <div>
    <!-- Single root div required by Vue's <Transition>. Mobile: nothing visible here
         (acting.vue shows ContentSideMenu). lg+: full gallery rendered directly. -->
    <!--
      Desktop (lg+): all theater shows and films are fetched and displayed
      directly here — no ContentSideMenu or sub-page navigation needed.
    -->
    <div
      class="hidden lg:block w-full h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] overflow-y-auto"
    >
      <!-- Staggered image grid (same 7-column layout as acting/theater/index.vue) -->
      <transition-group
        name="fade-stagger"
        tag="div"
        class="grid gap-1 p-1"
        style="grid-template-columns: repeat(7, 1fr)"
      >
        <div
          v-for="img in displayedImages"
          :key="img.src"
          class="overflow-hidden aspect-[4/3] cursor-pointer"
          @mouseenter="hoveredYear = img.year"
          @mouseleave="hoveredYear = null"
          @click="openViewer(img)"
        >
          <NuxtImg
            :src="img.src"
            alt="Acting image"
            width="320"
            loading="lazy"
            class="acting-img w-full h-full object-cover object-top"
            :class="{ 'is-year-hovered': hoveredYear === img.year }"
          />
        </div>
      </transition-group>
    </div>

    <!-- Fullscreen image viewer overlay (only reachable from the lg+ grid) -->
    <TheaterShowImageViewer
      :open="viewerOpen"
      :images="viewerImages"
      :start-index="viewerStartIndex"
      @close="viewerOpen = false"
    />
  </div>
</template>

<style scoped>
/* Same high-contrast grayscale treatment as acting/theater/index.vue */
.acting-img {
  display: block;
  filter: grayscale(400%) contrast(800%);
  border: 2px solid #000;
  transition: filter 0.1s ease;
  width: 100%;
  height: 100%;
  background: #e0e0e0;
}

/* Reveal colour on year-group hover */
.acting-img.is-year-hovered {
  filter: none;
}

.fade-stagger-enter-active,
.fade-stagger-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-stagger-enter-from,
.fade-stagger-leave-to {
  opacity: 0;
}
.fade-stagger-enter-to,
.fade-stagger-leave-from {
  opacity: 1;
}
</style>
