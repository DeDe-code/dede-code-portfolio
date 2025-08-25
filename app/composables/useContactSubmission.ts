// composables/useContactSubmission.ts
interface SubmissionData {
  email: string;
  message: string;
}

export const useContactSubmission = () => {
  const isSubmitting = ref(false);
  const submitStatus = ref<"idle" | "success" | "error">("idle");
  const currentRetry = ref(0);

  const submitForm = async (
    formData: SubmissionData,
    onSuccess?: () => void,
    onError?: (error: string) => void,
    maxRetries = 2
  ): Promise<boolean> => {
    isSubmitting.value = true;
    currentRetry.value = 0;

    while (currentRetry.value <= maxRetries) {
      try {
        await $fetch("/api/contact", {
          method: "POST",
          body: { email: formData.email, message: formData.message },
        });

        submitStatus.value = "success";
        if (onSuccess) onSuccess();
        isSubmitting.value = false;
        currentRetry.value = 0;
        return true;
      } catch (error) {
        currentRetry.value++;
        if (currentRetry.value > maxRetries) {
          console.error("Submit error after retries:", error);
          submitStatus.value = "error";
          if (onError) {
            onError(
              `Failed to send message after ${currentRetry.value} attempts. Please try again later.`
            );
          }
          isSubmitting.value = false;
          return false;
        }
        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * currentRetry.value)
        );
      }
    }

    isSubmitting.value = false;
    return false;
  };

  const resetSubmissionState = () => {
    isSubmitting.value = false;
    submitStatus.value = "idle";
    currentRetry.value = 0;
  };

  return {
    isSubmitting: readonly(isSubmitting),
    submitStatus: readonly(submitStatus),
    currentRetry: readonly(currentRetry),
    submitForm,
    resetSubmissionState,
  };
};
