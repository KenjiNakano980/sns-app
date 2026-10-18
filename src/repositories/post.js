import { supabase } from '../lib/supabase.js';

export const postRepository = {
  // 投稿を保存する
  async create(content, userId) {
    const { data, error } = await supabase
      .from('post')
      .insert([{ content, user_id: userId }])
      .select();

    if (error) throw error;

    return data[0];
  },

  // 投稿一覧をページ単位で取得する
  async find(page = 1, limit = 100) {
    const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

    const start = (currentPage - 1) * limit;
    const end = start + limit - 1;

    const { data, error } = await supabase
      .from('posts_view')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return data.map((post) => ({
      ...post,
      userName: post.user_name,
    }));
  },

  // 投稿を削除する
  async remove(postId, userId) {
    const { data, error } = await supabase
      .from('post')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId)
      .select('id');

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('投稿を削除できませんでした');
    }
  },
};
