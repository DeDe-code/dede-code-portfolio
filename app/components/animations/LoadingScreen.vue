<script setup lang="ts">
const emit = defineEmits<{ complete: [] }>();

const { pixelBlocks, percentText, start } = useLoadingAnimation(() =>
  emit("complete"),
);

onMounted(() => start(".loading-screen"));
</script>

<template>
  <div class="loading-screen">
    <div class="scanlines" />

    <div class="loading-content">
      <div class="site-title">dede</div>

      <div class="pixel-bar-wrapper">
        <div class="pixel-bar">
          <div
            v-for="(filled, i) in pixelBlocks"
            :key="i"
            class="pixel-block"
            :class="{ 'pixel-block--active': filled }"
          />
        </div>
      </div>

      <div class="loading-percentage">{{ percentText }}%</div>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: "Doto", sans-serif;
  overflow: hidden;
  opacity: 0;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.07) 2px,
    rgba(0, 0, 0, 0.07) 4px
  );
  pointer-events: none;
  z-index: 1;
}

.loading-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.site-title {
  font-size: clamp(36px, 8vw, 56px);
  font-weight: 900;
  color: #ef4444;
  letter-spacing: 10px;
  text-shadow:
    0 0 8px rgba(239, 68, 68, 0.7),
    0 0 24px rgba(239, 68, 68, 0.3);
}

.pixel-bar-wrapper {
  padding: 5px;
  border: 2px solid #2e2e2e;
  background: #111;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.6);
}

.pixel-bar {
  display: flex;
  gap: 3px;
  padding: 3px;
}

.pixel-block {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background-color: #1e1e1e;
  border: 1px solid #2a2a2a;
  /* Override global theme transition so GSAP controls timing */
  transition: none !important;
}

.pixel-block--active {
  background-color: #ef4444;
  border-color: #c53030;
  box-shadow:
    0 0 4px rgba(239, 68, 68, 0.9),
    0 0 10px rgba(239, 68, 68, 0.4);
}

.loading-percentage {
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 900;
  color: #fefefb;
  letter-spacing: 6px;
  margin-top: 6px;
}
</style>
