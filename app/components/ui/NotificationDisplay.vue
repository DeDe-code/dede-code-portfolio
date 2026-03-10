<script setup lang="ts">
import { gsap } from "gsap";

interface Props {
  type: "success" | "error" | "loading";
  isVisible: boolean;
  message: string;
  showSuccessText?: boolean;
  animationConfig?: {
    textDuration?: number;
    containerDuration?: number;
    textDelay?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  showSuccessText: false,
  animationConfig: () => ({
    textDuration: 2,
    containerDuration: 0.4,
    textDelay: 0,
  }),
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
const currentAnimation = ref<gsap.core.Tween | null>(null);
const shouldRender = ref(false);

// Handle rendering state for smooth animations
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      shouldRender.value = true;
    } else {
      // Delay hiding the element until animation completes
      setTimeout(
        () => {
          shouldRender.value = false;
        },
        (props.animationConfig?.containerDuration || 0.4) * 1000,
      );
    }
  },
  { immediate: true },
);

// Function to animate text typing effect
const animateText = (targetText: string, delay = 0) => {
  if (currentAnimation.value) {
    currentAnimation.value.kill();
  }
  animatedText.value = "";

  try {
    currentAnimation.value = gsap.to(
      { progress: 0 },
      {
        progress: 1,
        duration: props.animationConfig?.textDuration || 2,
        delay: delay || props.animationConfig?.textDelay || 0,
        ease: "none",
        onUpdate: function () {
          const progress = this.targets()[0].progress;
          const currentLength = Math.floor(progress * targetText.length);
          animatedText.value = targetText.substring(0, currentLength);
        },
        onComplete: () => {
          currentAnimation.value = null;
        },
      },
    );
  } catch (error) {
    console.warn("GSAP text animation error:", error);
    // Fallback: show text immediately
    animatedText.value = targetText;
    currentAnimation.value = null;
  }
};
onUnmounted(() => {
  if (currentAnimation.value) {
    currentAnimation.value.kill();
  }
});

// Single watcher to handle all animation triggers
watch(
  [() => props.message, () => props.showSuccessText, () => props.isVisible],
  ([newMessage, showSuccessText, isVisible]) => {
    // Only animate if notification is visible and has a message
    if (!newMessage || !isVisible) return;

    if (props.type === "success") {
      // For success, only animate after showSuccessText becomes true
      if (showSuccessText) {
        animateText(newMessage);
      }
    } else if (props.type === "error") {
      // For error, animate immediately with delay
      animateText(newMessage, 0.45);
    } else if (props.type === "loading") {
      // For loading, animate immediately
      animateText(newMessage);
    }
  },
  { immediate: true },
);

// Animate container when visibility changes
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      // Show animation - wait for next tick to ensure element is mounted
      nextTick(() => {
        if (!notificationEl.value) return;

        try {
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
              duration: props.animationConfig?.containerDuration || 0.4,
              ease: "back.out(1.2)",
            },
          );
        } catch (error) {
          console.warn("GSAP container show animation error:", error);
          // Fallback: set visible state directly
          if (notificationEl.value) {
            notificationEl.value.style.opacity = "1";
            notificationEl.value.style.transform =
              "scale(1) translateY(0) rotateX(0)";
          }
        }
      });
    } else {
      // Hide animation - same timing and properties as show animation
      if (!notificationEl.value) return;

      try {
        gsap.to(notificationEl.value, {
          opacity: 0,
          scale: 0.8,
          y: -50,
          rotationX: -90,
          duration: props.animationConfig?.containerDuration || 0.4,
          ease: "back.in(1.2)",
        });
      } catch (error) {
        console.warn("GSAP container hide animation error:", error);
        // Fallback: set hidden state directly
        if (notificationEl.value) {
          notificationEl.value.style.opacity = "0";
          notificationEl.value.style.transform =
            "scale(0.8) translateY(-50px) rotateX(-90deg)";
        }
      }
    }
  },
);

// Expose refs for external access if needed
defineExpose({
  notificationEl,
  notificationText,
});
</script>

<template>
  <div
    v-if="shouldRender"
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
