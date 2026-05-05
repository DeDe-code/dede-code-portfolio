<script setup lang="ts">
import { useTypewriterAnimation } from "~/composables/animations/useTypewriterAnimation";

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

// ── Typewriter refs ─────────────────────────────────────────────────────────
const elYear = ref<HTMLElement>();
const elTitle = ref<HTMLElement>();
const elRole = ref<HTMLElement>();
const elDirector = ref<HTMLElement>();

const { play, stop } = useTypewriterAnimation();

const currentMetaKey = computed(() => {
  const item = props.images[currentIndex.value];
  return item ? `${item.year}|${item.title}|${item.role}|${item.director}` : "";
});

function playTypewriter() {
  const item = props.images[currentIndex.value];
  if (!item) return;
  nextTick(() => {
    play(
      [elYear.value, elTitle.value, elRole.value, elDirector.value],
      [item.year, item.title, item.role, `Director: ${item.director}`],
      { charDelay: 0.07, cursor: true },
    );
  });
}

// ── Navigation ───────────────────────────────────────────────────────────────
function goTo(index: number) {
  currentIndex.value =
    ((index % props.images.length) + props.images.length) % props.images.length;
}

function close() {
  emit("close");
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") close();
  if (e.key === "ArrowRight" || e.key === "ArrowDown")
    goTo(currentIndex.value + 1);
  if (e.key === "ArrowLeft" || e.key === "ArrowUp")
    goTo(currentIndex.value - 1);
}

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(
  () => props.startIndex,
  (v) => {
    currentIndex.value = v;
  },
);

watch(currentMetaKey, () => {
  playTypewriter();
});

watch(
  () => props.open,
  (v) => {
    document.body.style.overflow = v ? "hidden" : "";
    if (v) nextTick(() => playTypewriter());
    else stop();
  },
);

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
  stop();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <div
          class="relative w-full h-full max-w-[87vw] max-h-[80vh] bg-white-50 grid overflow-hidden border-4 border-black shadow-xl"
          style="grid-template-rows: 8rem 1fr"
        >
          <!-- ── Top bar: metadata + close ──────────────────────────────────── -->
          <div
            class="flex items-start justify-between px-spacing-300 pt-spacing-300 pb-spacing-100"
          >
            <!-- Metadata (typewriter animated) -->
            <div
              class="flex flex-col gap-y-1 uppercase leading-tight max-w-[70%]"
            >
              <span ref="elYear" class="text-preset-5 text-gray-900" />
              <span ref="elTitle" class="text-preset-2 text-gray-900" />
              <span ref="elRole" class="text-preset-4 text-gray-900" />
              <span ref="elDirector" class="text-preset-5 text-gray-900" />
            </div>

            <!-- Close button -->
            <button
              class="border-2 border-black px-spacing-100 py-1 text-preset-5 uppercase tracking-widest shrink-0 ml-4 hover:bg-black hover:text-white-50 transition-colors"
              @click="close"
            >
              ✕ ESC
            </button>
          </div>

          <!-- ── Body: image + numbered navigation ──────────────────────────── -->
          <div class="flex min-h-0 items-center">
            <!-- Image area -->
            <div
              class="flex-1 flex items-center justify-center h-full px-spacing-300 pb-spacing-300"
            >
              <Transition name="img-fade" mode="out-in">
                <NuxtImg
                  :key="currentIndex"
                  :src="images[currentIndex]?.src"
                  :alt="images[currentIndex]?.title"
                  loading="lazy"
                  class="max-w-full max-h-full object-contain select-none"
                />
              </Transition>
            </div>

            <!-- Numbered navigation (right edge, vertically centered) -->
            <div
              class="flex flex-col items-end justify-center gap-y-1 pr-spacing-200 pb-spacing-300 self-stretch shrink-0 w-10"
            >
              <button
                v-for="(_, i) in images"
                :key="i"
                class="text-preset-6-mobile font-black w-full text-right text-xl uppercase transition-colors leading-tight"
                :class="
                  i === currentIndex
                    ? 'text-gray-900'
                    : 'text-gray-900/30 hover:text-gray-900'
                "
                @click="goTo(i)"
              >
                {{ i === currentIndex ? "■" : i + 1 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Viewer overlay fade */
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.2s ease;
}
.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

/* Image cross-fade on slide change */
.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.15s ease;
}
.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}
</style>
