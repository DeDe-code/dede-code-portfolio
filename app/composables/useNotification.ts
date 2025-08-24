// composables/useNotification.ts
export const useNotification = () => {
  const message = ref("");
  const type = ref<"success" | "error" | "loading">("error");
  const isVisible = ref(false);
  const showSuccessText = ref(false);

  const showNotification = (
    msg: string,
    notificationType = "error" as "success" | "error"
  ) => {
    message.value = msg;
    type.value = notificationType;
    isVisible.value = true;

    if (notificationType === "success") {
      // Phase 1: Show loading first
      showSuccessText.value = false;

      // Phase 2: After 1s, switch to text
      setTimeout(() => {
        showSuccessText.value = true;
      }, 1000);
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    isVisible.value = false;
    showSuccessText.value = false;
  };

  const showLoading = () => {
    type.value = "loading";
    isVisible.value = true;
  };

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
