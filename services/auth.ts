
import { supabase } from './supabase';

export const auth = {
  async signUp(email: string, password: string, username: string, governorate?: string, center?: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName || '',
          governorate: governorate || '',
          center: center || '',
        },
        emailRedirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Redirect back to app after click
    });
    return { data, error };
  },

  async resendConfirmation(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  async getUser() {
    // Validates the user with the server, bypassing local cache
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  }
  ,

  async signInWithProvider(provider: string) {
    // Starts an OAuth sign-in flow (redirects to provider)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { data, error };
  },

  async adminResetPassword(userId: string, newPassword: string) {
    // Requires VITE_SUPABASE_SERVICE_KEY in environment
    const admin = await import('../services/supabaseAdmin').then(m => m.supabaseAdmin);
    if (!admin) {
      return { data: null, error: { message: 'مفتاح الخدمة غير مضبط. أضف VITE_SUPABASE_SERVICE_KEY في الإعدادات.' } };
    }
    const { data, error } = await admin.auth.admin.updateUserById(userId, { password: newPassword });
    if (error) return { data: null, error: { message: 'فشل تغيير كلمة المرور: ' + error.message } };
    return { data, error: null };
  }
};
