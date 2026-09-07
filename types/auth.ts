export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  credits: number;
}

export type AuthModalMode = 'signup' | 'signin';

export interface AuthState {
  user: any | null;
  credits: number;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
}

export interface AuthFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  redirectUrl?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResult {
  user: any | null;
  session: any | null;
  infoMessage?: string | null;
}
