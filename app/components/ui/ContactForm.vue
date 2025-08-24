<script setup lang="ts">
// Composables
const {
  type: notificationType,
  isVisible,
  showNotification,
  showSuccessText,
  message: notificationMessage,
} = useNotification();

const { validateForm, getTrimmedFormData } = useFormValidation();
const { isSubmitting, submitForm } = useContactSubmission();

// Form state
const email = ref("");
const message = ref("");

// Form submission handler
const handleSubmit = async () => {
  const formData = { email: email.value, message: message.value };

  // Validate form
  const validation = validateForm(formData);
  if (!validation.isValid) {
    showNotification(validation.error!, "error");
    return;
  }

  // Get trimmed data
  const trimmedData = getTrimmedFormData(formData);

  // Submit form
  await submitForm(
    trimmedData,
    // Success callback
    () => {
      // Reset form
      email.value = "";
      message.value = "";

      // Show success notification
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
    },
    // Error callback
    (errorMessage: string) => {
      showNotification(errorMessage, "error");
    }
  );
};
</script>
<template>
  <div class="flex flex-col space-y-6 w-full mt-8">
    <!-- Use the extracted NotificationDisplay component -->
    <UiNotificationDisplay
      :type="notificationType"
      :is-visible="isVisible"
      :message="notificationMessage"
      :show-success-text="showSuccessText"
    />

    <UFormField label="Email">
      <UInput v-model="email" placeholder="Enter your email" size="xl" />
    </UFormField>
    <UFormField label="Message">
      <UTextarea
        v-model="message"
        placeholder="Enter your message"
        size="xl"
        class="w-full"
      />
    </UFormField>
    <UButton
      icon="uim:rocket"
      size="md"
      variant="solid"
      class="w-38"
      :disabled="isSubmitting"
      @click="handleSubmit"
    >
      {{ isSubmitting ? "Sending..." : "Send" }}
    </UButton>
  </div>
</template>
