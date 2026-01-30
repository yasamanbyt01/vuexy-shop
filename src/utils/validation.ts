export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Common validation functions
export const validateRequired = (
  value: string,
  fieldName: string,
): string | null => {
  if (!value?.trim()) {
    return `Please enter your ${fieldName}`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) {
    return "Please enter your email";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address";
  }

  return null;
};

export const validateEmailOrUsername = (input: string): string | null => {
  if (!input?.trim()) {
    return "Please enter your email or username";
  }

  // If it contains @, validate as email
  if (input.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.trim())) {
      return "Please enter a valid email address";
    }
  }

  return null;
};

export const validatePassword = (
  password: string,
  minLength: number = 8,
): string | null => {
  if (!password) {
    return "Please enter your password";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

export const validateTerms = (accepted: boolean): string | null => {
  if (!accepted) {
    return "You must agree to the terms";
  }
  return null;
};

// Form-specific validation schemas
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}) => {
  const errors: Record<string, string> = {};

  const emailError = validateEmailOrUsername(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password, 6); // Login can be 6 chars
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (formData: {
  username: string;
  email: string;
  password: string;
  terms: boolean;
}) => {
  const errors: Record<string, string> = {};

  const usernameError = validateRequired(formData.username, "username");
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password, 8); // Register requires 8 chars
  if (passwordError) errors.password = passwordError;

  const termsError = validateTerms(formData.terms);
  if (termsError) errors.terms = termsError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPasswordForm = (email: string) => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPasswordForm = (formData: {
  password: string;
  confirmPassword: string;
}) => {
  const errors: Record<string, string> = {};

  const passwordError = validatePassword(formData.password, 8);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword,
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
