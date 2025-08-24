// composables/useFormValidation.ts
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface FormData {
  email: string;
  message: string;
}

export const useFormValidation = () => {
  const validateEmail = (email: string): ValidationResult => {
    const trimmedEmail = email.trim();

    // Required field validation
    if (!trimmedEmail) {
      return { isValid: false, error: "Email is required" };
    }

    // Email length validation
    if (trimmedEmail.length > 254) {
      return { isValid: false, error: "Email address is too long" };
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
  };

  const validateMessage = (message: string): ValidationResult => {
    const trimmedMessage = message.trim();

    // Required field validation
    if (!trimmedMessage) {
      return { isValid: false, error: "Message is required" };
    }

    // Message length validation (prevent spam)
    if (trimmedMessage.length > 5000) {
      return {
        isValid: false,
        error: "Message is too long (max 5000 characters)",
      };
    }

    if (trimmedMessage.length < 10) {
      return {
        isValid: false,
        error: "Please enter a more detailed message (min 10 characters)",
      };
    }

    return { isValid: true };
  };

  const validateForm = (formData: FormData): ValidationResult => {
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      return emailValidation;
    }

    // Validate message
    const messageValidation = validateMessage(formData.message);
    if (!messageValidation.isValid) {
      return messageValidation;
    }

    // Check if both fields are provided (additional safety check)
    if (!formData.email.trim() || !formData.message.trim()) {
      return { isValid: false, error: "Please fill in all fields!" };
    }

    return { isValid: true };
  };

  const getTrimmedFormData = (formData: FormData): FormData => {
    return {
      email: formData.email.trim(),
      message: formData.message.trim(),
    };
  };

  return {
    validateEmail,
    validateMessage,
    validateForm,
    getTrimmedFormData,
  };
};
