import { getSupabaseClient } from '@/utils/supabase/client';
import { SignUpParams, SignInParams, AuthResult } from '@/types/auth';

/**
 * Computes the absolute redirect URL for Supabase email confirmation link
 */
function getAuthRedirectUrl(customUrl?: string): string {
  if (customUrl) return customUrl;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (siteUrl) {
    const formatted = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
    return `${formatted.replace(/\/$/, '')}/auth/callback`;
  }

  return 'http://localhost:3000/auth/callback';
}

export const authService = {
  /**
   * Signs up a new user with Supabase, attaching the redirect URL for confirmation email
   */
  async signUp({ email, password, fullName, phone, redirectUrl }: SignUpParams): Promise<AuthResult> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      throw new Error(
        'Supabase client is not configured. Please verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
      );
    }

    const emailRedirectTo = getAuthRedirectUrl(redirectUrl);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      try {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName.trim(),
            phone: phone.trim(),
            credits: 30,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      } catch (pErr) {
        console.warn('Profile upsert notice:', pErr);
      }
    }

    if (data.session) {
      return { user: data.user, session: data.session };
    }

    // If session wasn't auto-returned (email confirmation required), attempt direct sign-in
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInData?.session) {
      return { user: signInData.user, session: signInData.session };
    }

    return {
      user: data.user,
      session: null,
      infoMessage: signInErr?.message || 'Account created! Please check your email to confirm, or click Sign In below.',
    };
  },

  /**
   * Signs in an existing user with Supabase
   */
  async signIn({ email, password }: SignInParams): Promise<AuthResult> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      throw new Error(
        'Supabase client is not configured. Please verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      try {
        await supabase.from('profiles').upsert(
          {
            id: data.user.id,
            email: data.user.email,
            credits: 30,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      } catch (pErr) {
        console.warn('Profile sync notice:', pErr);
      }
    }

    return { user: data.user, session: data.session };
  },
};
