import { AuthFormData, ValidationResult } from '@/types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm(data: AuthFormData, isSignUp: boolean): ValidationResult {
  const { email, password, fullName, phone } = data;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }

  if (isSignUp) {
    if (!fullName.trim() || fullName.trim().length < 2) {
      return { isValid: false, error: 'Please enter your full name (at least 2 characters)' };
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (!phone.trim() || cleanPhone.length < 7) {
      return { isValid: false, error: 'Please enter a valid mobile number' };
    }
  }

  return { isValid: true, error: null };
}
