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
    <UFormField label="Email" :ui="{ label: '!mb-2 text-xl' }">
      <UInput
        v-model="email"
        placeholder="Enter your email"
        error="Please enter a valid email address."
        size="xl"
        :ui="{
          base: 'bg-transparent p-4 border-2 border-[var(--theme-border-primary)] focus:border-[#f1c40f] focus:!outline-none focus:!ring-0',
        }"
      />
    </UFormField>
    <UFormField label="Message" :ui="{ label: '!mb-2 text-xl' }">
      <UTextarea
        v-model="message"
        placeholder="Enter your message"
        error="Please enter a valid message."
        size="xl"
        class="w-full"
        :ui="{
          base: 'min-h-80 p-4 bg-transparent border-2 border-[var(--theme-border-primary)] focus:border-[#f1c40f] focus:!outline-none focus:!ring-0  ',
        }"
      />
    </UFormField>
    <UButton
      @click="submitForm"
      icon="uim:rocket"
      size="md"
      variant="solid"
      class="w-38"
      :ui="{
        base: 'p-4 pl-10 text-white bg-transparent hover:bg-[#e0b007]  border-2 border-[var(--theme-border-primary)] focus:border-[#f1c40f] focus:!outline-none focus:!ring-0',
      }"
    >
      Send
    </UButton>
  </div>
</template>

<style scoped></style>
