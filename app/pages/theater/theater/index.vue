<script setup lang="ts">
const { data } = await useAsyncData("theaterShowsIndex", () =>
  queryCollection("theaterShows").first(),
);

const allImages = computed<string[]>(() => {
  if (!data.value?.items) return [];
  return data.value.items.flatMap((show) =>
    useShowImages(show.title, show.imageCount),
  );
});

const visibleImages = ref<number[]>([]);
const revealed = ref(false);

function revealImagesStaggered() {
  if (revealed.value) return;
  revealed.value = true;
  visibleImages.value = [];
  if (!allImages.value.length) return;
  const totalDuration = 800; // ms — fixed reveal window regardless of image count
  const step = totalDuration / allImages.value.length;
  allImages.value.forEach((_, i) => {
    setTimeout(() => {
      visibleImages.value.push(i);
    }, i * step);
  });
}

onMounted(() => {
  const handler = () => {
    revealImagesStaggered();
    window.removeEventListener("page:transition:finish", handler);
  };
  window.addEventListener("page:transition:finish", handler);
  setTimeout(() => {
    revealImagesStaggered();
  }, 600);
});
</script>

<template>
  <div
    class="w-full h-[calc(100vh_-_var(--min-height-app-header)_-_var(--min-height-app-footer))] overflow-y-auto"
  >
    <!-- mobile: back link + submenu -->
    <div class="w-full lg:hidden">
      <ULink
        to="/theater"
        class="w-full flex flex-col justify-center py-spacing-100 px-spacing-200 text-gray-700 hover:bg-gray-100 inset-shadow-stone-600"
      >
        ..
      </ULink>
      <ContentSideDropdownMenu />
    </div>

    <!-- image grid -->
    <transition-group
      name="fade-stagger"
      tag="div"
      class="grid gap-1 p-1"
      style="grid-template-columns: repeat(7, 1fr)"
    >
      <div
        v-for="(img, i) in allImages"
        v-show="visibleImages.includes(i)"
        :key="i"
        class="overflow-hidden aspect-[4/3]"
      >
        <NuxtImg
          :src="img"
          alt="Theater Image"
          class="theater-img w-full h-full object-cover object-top"
        />
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.theater-img {
  display: block;
  filter: grayscale(400%) contrast(800%);
  border: 2px solid #000;
  transition: filter 0.1s ease;
  width: 100%;
  height: 100%;
  background: #e0e0e0;
}

.theater-img:hover {
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
