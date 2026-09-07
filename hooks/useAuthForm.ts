'use client';

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { AuthFormData, AuthModalMode } from '@/types/auth';
import { validateAuthForm } from '@/utils/validation';
import { authService } from '@/services/authService';

interface UseAuthFormOptions {
  isOpen: boolean;
  initialMode?: AuthModalMode;
  onSuccess: (user: any) => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA: AuthFormData = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
};

export function useAuthForm({ isOpen, initialMode = 'signup', onSuccess, onClose }: UseAuthFormOptions) {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === 'signup');
  const [formData, setFormData] = useState<AuthFormData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrorMsg(null);
    setInfoMsg(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      resetForm();
    } else {
      resetForm();
    }
  }, [isOpen, initialMode, resetForm]);

  const updateField = useCallback((field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg(null);
  }, []);

  const handleChange = useCallback(
    (field: keyof AuthFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      updateField(field, e.target.value);
    },
    [updateField]
  );

  const handleModeSwitch = useCallback((signUpState: boolean) => {
    setIsSignUp(signUpState);
    setErrorMsg(null);
    setInfoMsg(null);
    setFormData((prev) => ({ ...prev, password: '' }));
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setInfoMsg(null);

      // Validation check via pure utility function
      const validation = validateAuthForm(formData, isSignUp);
      if (!validation.isValid) {
        setErrorMsg(validation.error);
        return;
      }

      setLoading(true);

      try {
        if (isSignUp) {
          const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
          const result = await authService.signUp({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            redirectUrl,
          });

          if (result.session && result.user) {
            resetForm();
            onSuccess(result.user);
            onClose();
          } else if (result.infoMessage) {
            setInfoMsg(result.infoMessage);
            setFormData((prev) => ({ ...prev, password: '' }));
            setIsSignUp(false);
          }
        } else {
          const result = await authService.signIn({
            email: formData.email,
            password: formData.password,
          });

          if (result.user) {
            resetForm();
            onSuccess(result.user);
            onClose();
          }
        }
      } catch (err: any) {
        console.error('Auth submit error:', err);
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [formData, isSignUp, onSuccess, onClose, resetForm]
  );

  return {
    isSignUp,
    formData,
    loading,
    errorMsg,
    infoMsg,
    handleChange,
    updateField,
    handleModeSwitch,
    handleClose,
    handleSubmit,
    resetForm,
  };
}
