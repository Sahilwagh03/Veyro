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
