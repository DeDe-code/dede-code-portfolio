<script setup lang="ts">
const {
  type: notificationType,
  isVisible,
  notificationEl,
  notificationText,
  showNotification,
  showSuccessText,
  animatedText,
} = useNotification();
const appConfig = useAppConfig();

const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");
const handleNotification = (
  message: string,
  type: "error" | "success" = "error"
) => {
  showNotification(message, type);
};
const notificationClasses = computed(() => {
  const variant = appConfig.notification.variants[notificationType.value];

  return {
    base: appConfig.notification.base,
    overlay: appConfig.notification.overlay,
    container:
      `${appConfig.notification.container} ${variant?.container || ""}`.trim(),
    icon: variant?.icon || "",
  };
});

// Form submission function
const submitForm = async () => {
  // Trim whitespace
  const emailTrimmed = email.value.trim();
  const messageTrimmed = message.value.trim();

  // Required field validation
  if (!emailTrimmed || !messageTrimmed) {
    handleNotification("Please fill in all fields!", "error");
    return;
  }

  // Email length validation
  if (emailTrimmed.length > 254) {
    handleNotification("Email address is too long", "error");
    return;
  }

  // Improved email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(emailTrimmed)) {
    handleNotification("Please enter a valid email address", "error");
    return;
  }

  // Message length validation (prevent spam)
  if (messageTrimmed.length > 5000) {
    handleNotification("Message is too long (max 5000 characters)", "error");
    return;
  }

  if (messageTrimmed.length < 10) {
    handleNotification(
      "Please enter a more detailed message (min 10 characters)",
      "error"
    );
    return;
  }

  // Continue with submission using trimmed values
  isSubmitting.value = true;
  submitStatus.value = "idle";

  try {
    // Call your API endpoint
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        email: emailTrimmed,
        message: messageTrimmed,
      },
    });

    // Success handling
    submitStatus.value = "success";

    // Reset form
    email.value = "";
    message.value = "";

    // Success feedback
    handleNotification(
      "Message sent successfully! I'll get back to you soon.",
      "success"
    );
  } catch (error) {
    console.error("Submit error:", error);
    submitStatus.value = "error";
    handleNotification(
      "Failed to send message. Please try again later.",
      "error"
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col space-y-6 w-full mt-8">
    <div
      v-show="isVisible"
      ref="notificationEl"
      :class="notificationClasses.base"
    >
      <div ref="notificationText" :class="notificationClasses.container">
        <!-- Success notification: Show loading first, then text -->
        <template v-if="notificationType === 'success'">
          <Icon
            v-if="!showSuccessText"
            name="svg-spinners:ring-resize"
            class="mr-2"
          />
          <span v-if="showSuccessText">{{ animatedText }}</span>
        </template>

        <!-- Error notification: Show icon with text immediately -->
        <template v-else-if="notificationType === 'error'">
          <Icon name="material-symbols:error" class="mr-2" />
          <span>{{ animatedText }}</span>
        </template>

        <!-- Loading notification: Show loading icon with text -->
        <template v-else-if="notificationType === 'loading'">
          <Icon name="svg-spinners:ring-resize" class="mr-2" />
          <span>{{ animatedText }}</span>
        </template>
      </div>
    </div>
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
      @click="submitForm"
    >
      Send
    </UButton>
  </div>
</template>
