// utils/validation.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  // Add more password validation rules as needed
  // For example:
  // if (!/[A-Z]/.test(password)) {
  //   return "Password must contain at least one uppercase letter";
  // }

  return null;
};
