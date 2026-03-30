<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data } = await useAsyncData(`codeProject-${slug}`, () =>
  queryCollection("codeProjects").first(),
);

const project = computed(() =>
  data.value?.items?.find((item) => item.title === slug),
);

const frameRefs = ref<HTMLElement[]>([]);

// Track which images are visible
const visibleImages = ref<number[]>([]);

// Helper to reveal images one by one after transition
function revealImagesStaggered() {
  visibleImages.value = [];
  if (!gridImages.value.length) return;
  gridImages.value.forEach((_, i) => {
    setTimeout(() => {
      visibleImages.value.push(i);
    }, i * 120); // 120ms stagger
  });
}

// Wait for Nuxt page transition to finish
onMounted(() => {
  // Nuxt emits 'page:transition:finish' on window
  const handler = () => {
    revealImagesStaggered();
    window.removeEventListener("page:transition:finish", handler);
  };
  window.addEventListener("page:transition:finish", handler);
  // Fallback: if no transition, reveal after mount
  setTimeout(() => {
    if (visibleImages.value.length === 0) revealImagesStaggered();
  }, 600);
});

// Re-run on project change
watch(project, () => {
  revealImagesStaggered();
});

// Masonry: decide how many images to show (repeat if needed)
// Custom grid layout to match the reference
const gridLayout = [
  { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
  { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 4, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 4, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 3, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 3, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 3, colSpan: 2, rowSpan: 2 },
  { col: 1, row: 4, colSpan: 2, rowSpan: 2 },
  { col: 3, row: 5, colSpan: 1, rowSpan: 1 },
  { col: 4, row: 5, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 6, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 6, colSpan: 1, rowSpan: 1 },
  { col: 3, row: 6, colSpan: 1, rowSpan: 1 },
  { col: 4, row: 6, colSpan: 1, rowSpan: 1 },
];

const gridImages = computed(() => {
  if (!project.value?.images?.length) return [];
  const arr = [];
  for (let i = 0; i < gridLayout.length; i++) {
    arr.push(project.value.images[i % project.value.images.length]);
  }
  return arr;
});

function setFrameRef(el: Element | null, i: number) {
  if (el) frameRefs.value[i] = el as HTMLElement;
}
</script>

<template>
  <div
    class="relative w-full max-w-[100%] h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] max-h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] bg-[#c3c7cb] flex items-center justify-center overflow-hidden"
  >
    <UPopover
      v-if="visibleImages.length > 4"
      class="absolute z-10 -top-1 -right-1"
      :close-on-click-outside="true"
    >
      <UIcon
        label="open"
        name="material-symbols-light:chat-info"
        class="z-10 w-[100px] h-[100px] text-black"
      />

      <template #content>
        <h1 class="text-2xl font-bold text-red-500">{{ project?.title }}</h1>
        <p class="text-black">{{ project?.description }}</p>
        <ULink
          v-if="project?.link"
          :href="project.link"
          target="_blank"
          class="block mt-2 text-black underline hover:text-black"
        >
          View Project
        </ULink>
      </template>
    </UPopover>

    <div
      v-if="project && project.images?.length"
      class="w-full h-full max-h-full p-4 overflow-hidden"
    >
      <transition-group
        name="fade-stagger"
        tag="div"
        class="grid gap-4 w-full h-full"
        style="
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(6, 1fr);
          height: 100%;
          max-height: 100%;
        "
      >
        <div
          v-for="(img, i) in gridImages"
          v-show="visibleImages.includes(i)"
          :key="i"
          :ref="(el) => setFrameRef(el as Element | null, i)"
          class="overflow-hidden rounded shadow w-full h-full flex"
          :style="
            (() => {
              const layout = gridLayout[i];
              if (!layout) return {};
              return {
                gridColumn: `${layout.col} / span ${layout.colSpan}`,
                gridRow: `${layout.row} / span ${layout.rowSpan}`,
              };
            })()
          "
        >
          <NuxtImg
            :src="img"
            alt="Project Image"
            class="project-img w-full h-full object-cover object-center"
            style="width: 100%; height: 100%"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.project-img {
  display: block;
  filter: grayscale(400%) contrast(800%);
  border: 2px solid #000;
  transition: filter 0.35s ease;
  width: 100%;
  height: 100%;
  background: #e0e0e0;
}

.project-img:hover {
  filter: none;
  image-rendering: auto;
}

/* Make some images span two columns in the masonry layout */
/* Fade stagger transition */
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
