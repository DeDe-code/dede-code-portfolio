// composables/useNotification.ts
import { gsap } from "gsap";

export const useNotification = () => {
  const message = ref("");
  const type = ref<"success" | "error" | "loading">("error");
  const isVisible = ref(false);
  const showSuccessText = ref(false);
  const animatedText = ref(""); // This will hold the animated text content
  const notificationEl = ref<HTMLElement>();
  const notificationText = ref<HTMLElement>();

  const showLoading = () => {
    type.value = "loading";
    isVisible.value = true;
  };

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

  const showNotification = (
    msg: string,
    notificationType = "error" as "success" | "error"
  ) => {
    message.value = msg;
    type.value = notificationType;
    isVisible.value = true;
    animatedText.value = ""; // Reset animated text

    // GSAP animation on next tick (after DOM update)
    nextTick(() => {
      if (notificationEl.value) {
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

        if (notificationType === "success") {
          // Phase 1: Show loading first
          showSuccessText.value = false;

          // Phase 2: After 1s, switch to text and animate
          setTimeout(() => {
            showSuccessText.value = true;

            nextTick(() => {
              // Animate text with custom function
              animateText(message.value);
            });
          }, 1000);
        } else if (notificationType === "error") {
          // Error messages: immediate text animation
          animateText(message.value, 0.45);
        }
      }
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    if (notificationEl.value) {
      gsap.to(notificationEl.value, {
        opacity: 0,
        scale: 0.8,
        y: -30,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          isVisible.value = false;
        },
      });
    } else {
      isVisible.value = false;
    }
  };

  return {
    message,
    type,
    isVisible,
    notificationEl,
    notificationText,
    showLoading,
    showNotification,
    hideNotification,
    showSuccessText,
    animatedText,
  };
};
