<script setup lang="ts">
const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");

// Form submission function
const submitForm = async () => {
  // Basic validation
  if (!email.value || !message.value) {
    alert("Please fill in all fields");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    alert("Please enter a valid email address");
    return;
  }

  isSubmitting.value = true;
  submitStatus.value = "idle";

  try {
    // Call your API endpoint
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        email: email.value,
        message: message.value,
      },
    });

    // Success handling
    submitStatus.value = "success";

    // Reset form
    email.value = "";
    message.value = "";

    // Success feedback
    alert("Message sent successfully! I'll get back to you soon.");
  } catch (error) {
    console.error("Submit error:", error);
    submitStatus.value = "error";
    alert("Failed to send message. Please try again later.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <div class="flex flex-col space-y-6 w-full mt-8">
    <UFormField label="Email">
      <UInput
        v-model="email"
        placeholder="Enter your email"
        error="Please enter a valid email address."
        size="xl"
      />
    </UFormField>
    <UFormField label="Message">
      <UTextarea
        v-model="message"
        placeholder="Enter your message"
        error="Please enter a valid message."
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
