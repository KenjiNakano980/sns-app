import { supabase } from '../lib/supabase.js';

export const postRepository = {
  async create(content, userId) {
    const { data, error } = await supabase
      .from('post')
      .insert([{ content, user_id: userId }])
      .select();

    if (error) throw error;

    return data[0];
  },
};