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
// Only disable form during submission, not during notification display
const isFormDisabled = computed(() => isSubmitting.value);

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

  let shouldResetForm = false;

  // Submit form
  await submitForm(
    trimmedData,
    () => {
      shouldResetForm = true;
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success",
      );
    },
    (errorMessage: string) => {
      showNotification(errorMessage, "error");
    },
  );
  // Reset form after a delay for better UX
  if (shouldResetForm) {
    setTimeout(() => {
      email.value = "";
      message.value = "";
    }, 1500);
  }
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
      <UInput
        v-model="email"
        placeholder="Enter your email"
        size="xl"
        :disabled="isFormDisabled"
        type="email"
        required
        autocomplete="email"
        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
        title="Please enter a valid email address"
      />
    </UFormField>
    <UFormField label="Message">
      <UTextarea
        v-model="message"
        placeholder="Enter your message"
        size="xl"
        class="w-full"
        :disabled="isFormDisabled"
        required
        minlength="10"
        maxlength="5000"
        autocomplete="off"
        title="Message must be between 10 and 5000 characters"
      />
    </UFormField>
    <UButton
      icon="uim:rocket"
      size="md"
      variant="solid"
      class="w-38"
      :disabled="isFormDisabled"
      @click="handleSubmit"
    >
      {{ isSubmitting ? "Sending..." : "Send" }}
    </UButton>
  </div>
</template>
