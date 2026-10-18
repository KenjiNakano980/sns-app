import { supabase } from '../lib/supabase.js';

export const authRepository = {
  async signup(name, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('ユーザー登録に失敗しました。');

    return {
      user: {
        ...data.user,
        userName: data.user.user_metadata?.name ?? '',
      },
      session: data.session,
    };
  },

  async signin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('ログインに失敗しました。');

    return {
      ...data.user,
      userName: data.user.user_metadata?.name ?? '',
    };
  },
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;
    if (!data.session) return null;

    const user = data.session.user;

    return {
      ...user,
      userName: user.user_metadata?.name ?? '',
    };
  },
  async signout() {
    const { error } = await supabase.auth.signOut({
      scope: 'local',
    });

    if (error) throw error;
  },
};
