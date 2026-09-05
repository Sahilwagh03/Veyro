import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!clientInstance && supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return clientInstance;
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
