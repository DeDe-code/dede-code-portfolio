<script setup lang="ts">
import { gsap } from "gsap";

interface Props {
  type: "success" | "error" | "loading";
  isVisible: boolean;
  message: string;
  showSuccessText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showSuccessText: false,
});

const appConfig = useAppConfig();
const animatedText = ref("");
const notificationEl = ref<HTMLElement>();
const notificationText = ref<HTMLElement>();

const notificationClasses = computed(() => {
  const variant = appConfig.notification.variants[props.type];

  return {
    base: appConfig.notification.base,
    overlay: appConfig.notification.overlay,
    container:
      `${appConfig.notification.container} ${variant?.container || ""}`.trim(),
    icon: variant?.icon || "",
  };
});

// Function to animate text typing effect
const animateText = (targetText: string, delay = 0) => {
  animatedText.value = "";

  gsap.to(
    { progress: 0 },
    {
      progress: 1,
      duration: 2,
      delay,
      ease: "none",
      onUpdate: function () {
        const progress = this.targets()[0].progress;
        const currentLength = Math.floor(progress * targetText.length);
        animatedText.value = targetText.substring(0, currentLength);
      },
    }
  );
};

// Watch for message changes and animate accordingly
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage && props.isVisible) {
      if (props.type === "success") {
        // For success, only animate after showSuccessText becomes true
        if (props.showSuccessText) {
          animateText(newMessage);
        }
      } else if (props.type === "error") {
        // For error, animate immediately with delay
        animateText(newMessage, 0.45);
      } else if (props.type === "loading") {
        // For loading, animate immediately
        animateText(newMessage);
      }
    }
  },
  { immediate: true }
);

// Watch for showSuccessText changes (for success notifications)
watch(
  () => props.showSuccessText,
  (showText) => {
    if (showText && props.type === "success" && props.message) {
      animateText(props.message);
    }
  }
);

// Animate container when visibility changes
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible && notificationEl.value) {
      gsap.fromTo(
        notificationEl.value,
        {
          opacity: 0,
          scale: 0.8,
          y: -50,
          rotationX: -90,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          duration: 0.4,
          ease: "back.out(1.2)",
        }
      );
    }
  }
);

// Expose refs for external access if needed
defineExpose({
  notificationEl,
  notificationText,
});
</script>

<template>
  <div
    v-show="isVisible"
    ref="notificationEl"
    :class="notificationClasses.base"
  >
    <div ref="notificationText" :class="notificationClasses.container">
      <!-- Success notification: Show loading first, then text -->
      <template v-if="type === 'success'">
        <Icon
          v-if="!showSuccessText"
          name="svg-spinners:ring-resize"
          class="mr-2"
        />
        <span v-if="showSuccessText">{{ animatedText }}</span>
      </template>

      <!-- Error notification: Show icon with text immediately -->
      <template v-else-if="type === 'error'">
        <Icon name="material-symbols:error" class="mr-2" />
        <span>{{ animatedText }}</span>
      </template>

      <!-- Loading notification: Show loading icon with text -->
      <template v-else-if="type === 'loading'">
        <Icon name="svg-spinners:ring-resize" class="mr-2" />
        <span>{{ animatedText }}</span>
      </template>
    </div>
  </div>
</template>
