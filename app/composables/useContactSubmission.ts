// composables/useContactSubmission.ts
interface SubmissionData {
  email: string;
  message: string;
}

export const useContactSubmission = () => {
  const isSubmitting = ref(false);
  const submitStatus = ref<"idle" | "success" | "error">("idle");

  const submitForm = async (
    formData: SubmissionData,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ): Promise<boolean> => {
    isSubmitting.value = true;
    submitStatus.value = "idle";

    try {
      // Call API endpoint
      await $fetch("/api/contact", {
        method: "POST",
        body: {
          email: formData.email,
          message: formData.message,
        },
      });

      // Success handling
      submitStatus.value = "success";

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error("Submit error:", error);
      submitStatus.value = "error";

      // Call error callback if provided
      if (onError) {
        onError("Failed to send message. Please try again later.");
      }

      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const resetSubmissionState = () => {
    isSubmitting.value = false;
    submitStatus.value = "idle";
  };

  return {
    isSubmitting: readonly(isSubmitting),
    submitStatus: readonly(submitStatus),
    submitForm,
    resetSubmissionState,
  };
};
