<script setup lang="ts">
export interface ShowImage {
  src: string;
  year: string;
  title: string;
  role: string;
  director: string;
}

const props = defineProps<{
  open: boolean;
  images: ShowImage[];
  startIndex: number;
}>();

const emit = defineEmits<{
  close: [];
}>();

const currentIndex = ref(props.startIndex);

watch(
  () => props.startIndex,
  (v) => {
    currentIndex.value = v;
  },
);

watch(
  () => props.open,
  (v) => {
    document.body.style.overflow = v ? "hidden" : "";
  },
);

function close() {
  emit("close");
}

function onKeydown(e: KeyboardEvent) {
  if (props.open && e.key === "Escape") close();
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
        @click.self="close"
      >
        <div
          class="relative w-full max-w-3xl mx-4 border-4 border-black bg-blue-950 shadow-2xl"
        >
          <!-- Header: season label + counter + close -->
          <div
            class="flex items-center justify-between border-b-4 border-black px-spacing-200 py-spacing-100 bg-gray-900 uppercase"
          >
            <span class="text-preset-2 text-red-400 tracking-widest">
              {{ images[currentIndex]?.year }}
            </span>
            <span class="text-preset-5 text-blue-500">
              {{ currentIndex + 1 }}&nbsp;/&nbsp;{{ images.length }}
            </span>
            <button
              class="border-4 border-black px-spacing-100 py-1 text-preset-4 text-red-400 hover:bg-red-400 hover:text-white-50 uppercase transition-colors"
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- Carousel -->
          <UCarousel
            v-slot="{ item }"
            :items="images"
            :start-index="startIndex"
            arrows
            dots
            loop
            :ui="{ item: 'basis-full' }"
            class="w-full"
            @select="currentIndex = $event"
          >
            <div class="w-full flex flex-col">
              <!-- Metadata above image -->
              <div
                class="px-spacing-200 py-spacing-100 border-b-4 border-black bg-blue-900 uppercase"
              >
                <h2 class="text-preset-3 text-white-50 leading-tight mb-1">
                  {{ item.title }}
                </h2>
                <div
                  class="flex flex-wrap gap-x-spacing-300 gap-y-1 text-preset-5"
                >
                  <span>
                    <span class="text-red-400">Year&nbsp;</span>
                    <span class="text-blue-500">{{ item.year }}</span>
                  </span>
                  <span>
                    <span class="text-red-400">Role&nbsp;</span>
                    <span class="text-white-100">{{ item.role }}</span>
                  </span>
                  <span>
                    <span class="text-red-400">Director&nbsp;</span>
                    <span class="text-white-100">{{ item.director }}</span>
                  </span>
                </div>
              </div>

              <!-- Image -->
              <div
                class="bg-gray-900 flex items-center justify-center"
                style="height: 55vh"
              >
                <NuxtImg
                  :src="item.src"
                  :alt="item.title"
                  loading="lazy"
                  class="max-w-full max-h-full object-contain"
                  style="max-height: 55vh"
                />
              </div>
            </div>
          </UCarousel>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.2s ease;
}
.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}
</style>
