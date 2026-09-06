import { getSupabaseClient } from '@/utils/supabase/client';

export const userService = {
  async fetchUserCredits(userId: string): Promise<number | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      // Retry once if trigger is completing profile insertion
      if (error || !data) {
        await new Promise((r) => setTimeout(r, 400));
        const retry = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (!error && data && typeof data.credits === 'number') {
        return data.credits;
      }
    } catch (err) {
      console.error('Failed to fetch user credits:', err);
    }
    return null;
  },

  async deductCredits(userId: string, currentCredits: number, amount: number = 10): Promise<number> {
    const supabase = getSupabaseClient();
    const newBal = Math.max(0, currentCredits - amount);
    if (!supabase || !userId) return newBal;

    try {
      const { data, error } = await supabase.rpc('increment_credits', {
        user_id: userId,
        amount: -amount,
      });

      if (!error && typeof data === 'number') {
        return data;
      } else {
        await supabase.from('profiles').upsert({
          id: userId,
          credits: newBal,
        });
        return newBal;
      }
    } catch (err) {
      console.error('Failed to deduct credits in database:', err);
      return newBal;
    }
  },

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  },
};
