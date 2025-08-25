// composables/useNotification.ts
interface NotificationConfig {
  successDelay?: number;
  autoHideDelay?: number;
}
export const useNotification = (config: NotificationConfig = {}) => {
  const { successDelay = 1000, autoHideDelay = 5000 } = config;
  const message = ref("");
  const type = ref<"success" | "error" | "loading">("error");
  const isVisible = ref(false);
  const showSuccessText = ref(false);

  // Timeout management
  let successTimeout: NodeJS.Timeout | null = null;
  let autoHideTimeout: NodeJS.Timeout | null = null;

  const clearTimeouts = () => {
    if (successTimeout) {
      clearTimeout(successTimeout);
      successTimeout = null;
    }
    if (autoHideTimeout) {
      clearTimeout(autoHideTimeout);
      autoHideTimeout = null;
    }
  };

  const showNotification = (
    msg: string,
    notificationType = "error" as "success" | "error"
  ) => {
    // Clear any existing timeouts
    clearTimeouts();

    message.value = msg;
    type.value = notificationType;
    isVisible.value = true;

    if (notificationType === "success") {
      // Phase 1: Show loading first
      showSuccessText.value = false;

      // Phase 2: After 1s, switch to text
      successTimeout = setTimeout(() => {
        showSuccessText.value = true;
        successTimeout = null;
      }, successDelay);
    }

    // Auto hide after 5 seconds
    autoHideTimeout = setTimeout(() => {
      hideNotification();
    }, autoHideDelay);
  };

  const hideNotification = () => {
    clearTimeouts();
    isVisible.value = false;
    showSuccessText.value = false;
  };

  const showLoading = () => {
    clearTimeouts();
    type.value = "loading";
    isVisible.value = true;
  };

  // Cleanup on unmount
  onUnmounted(() => {
    clearTimeouts();
  });

  return {
    message: readonly(message),
    type: readonly(type),
    isVisible: readonly(isVisible),
    showSuccessText: readonly(showSuccessText),
    showLoading,
    showNotification,
    hideNotification,
  };
};
