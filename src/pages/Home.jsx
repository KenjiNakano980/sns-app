import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { SessionContext } from '../SessionContext.js';
import { Pagination } from '../components/Pagination.jsx';
import { SideMenu } from '../components/SideMenu.jsx';
import { Post } from '../components/Post.jsx';
import { authRepository } from '../repositories/auth.js';
import { postRepository } from '../repositories/post.js';

function Home() {
  // ログインユーザー情報
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  // State管理
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ページネーション（1ページ5件）
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  // 投稿一覧を取得
  const fetchPosts = async () => {
    try {
      const data = await postRepository.find(1, 100);
      setPosts(data);
    } catch (error) {
      console.error('投稿の取得に失敗しました', error);
      setErrorMessage('投稿を読み込めませんでした。');
    }
  };

  // 初回表示・ログインユーザー変更時に投稿取得
  useEffect(() => {
    if (!currentUser) return;

    let ignore = false;

    const loadPosts = async () => {
      try {
        const data = await postRepository.find(1, 100);
        if (!ignore) {
          setPosts(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error('投稿の取得に失敗しました', error);
          setErrorMessage('投稿を読み込めませんでした。');
        }
      }
    };

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [currentUser?.id]);

  // 投稿作成
  const createPost = async () => {
    if (!content.trim() || !currentUser) return;

    setErrorMessage('');

    try {
      await postRepository.create(content.trim(), currentUser.id);
      setContent('');
      setCurrentPage(1);
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '投稿に失敗しました。',
      );
    }
  };

  // 投稿削除
  const deletePost = async (postId) => {
    if (!currentUser) return;

    const confirmed = window.confirm('この投稿を削除しますか？');
    if (!confirmed) return;

    setErrorMessage('');

    try {
      await postRepository.remove(postId, currentUser.id);

      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.filter((post) => post.id !== postId);

        const updatedTotalPages = Math.ceil(updatedPosts.length / postsPerPage);

        setCurrentPage((prevPage) =>
          Math.max(1, Math.min(prevPage, updatedTotalPages)),
        );

        return updatedPosts;
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '投稿の削除に失敗しました。',
      );
    }
  };

  // ログアウト
  const signout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setErrorMessage('');

    try {
      await authRepository.signout();
      setCurrentUser(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'ログアウトに失敗しました。',
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  // 未ログインならログイン画面へ
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#34443C]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 border-b border-[#E3E8DF] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#789985] text-2xl text-white shadow-sm">
              ✿
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#344F40]">
                Sage Community
              </h1>
              <p className="text-[10px] tracking-[0.2em] text-[#91A497]">
                CONNECT & SHARE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={signout}
            disabled={isSigningOut}
            className="shrink-0 rounded-full border border-[#D9E4DA] bg-white px-4 py-2 text-sm font-medium text-[#58715F] transition hover:bg-[#EDF3EC] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >
            {isSigningOut ? 'ログアウト中…' : 'ログアウト'}
          </button>
        </div>
      </header>

      {/* メイン */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ウェルカムエリア */}
        <div className="mb-9">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#8CA391]">
            YOUR COMMUNITY
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-[#344F40] sm:text-3xl">
            今日の気持ちを、シェアしよう。
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#8A948C]">
            日々の小さな発見や、何気ないひとことを。
            <br className="hidden sm:block" />
            ここから、やさしいつながりが生まれます。
          </p>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <p
            role="alert"
            className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
          >
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-3">
          {/* タイムライン */}
          <section className="space-y-7 lg:col-span-2">
            {/* 投稿フォーム */}
            <div className="rounded-3xl border border-[#E8EBE4] bg-white p-5 shadow-[0_8px_30px_rgba(52,79,64,0.05)] sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFE7] text-2xl">
                  🌿
                </div>

                <div>
                  <h3 className="font-semibold text-[#344F40]">新しい投稿</h3>
                  <p className="text-xs text-[#98A59A]">
                    あなたの言葉を届けましょう
                  </p>
                </div>
              </div>

              <textarea
                className="min-h-32 w-full resize-y rounded-2xl border border-[#E3EAE1] bg-[#FAFBF8] p-4 text-sm leading-7 text-[#34443C] outline-none transition placeholder:text-[#A4B1A5] focus:border-[#8EAC96] focus:ring-2 focus:ring-[#DCE9DE]"
                placeholder="今日はどんな一日でしたか？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-[#A0ADA2]">
                  Share your moment ✨
                </span>

                <button
                  type="button"
                  onClick={createPost}
                  disabled={!content.trim()}
                  className="rounded-full bg-[#72947C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#587A63] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  投稿する →
                </button>
              </div>
            </div>

            {/* 投稿一覧 */}
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#344F40]">
                  🌱 タイムライン
                </h3>

                <span className="rounded-full bg-[#E7EEE5] px-3 py-1 text-xs font-medium text-[#6C8973]">
                  Community Feed
                </span>
              </div>

              {currentPosts.length === 0 ? (
                <div className="rounded-3xl border border-[#E8EBE4] bg-white p-10 text-center shadow-sm">
                  <p className="mb-3 text-3xl">🌼</p>
                  <p className="font-medium text-[#58715F]">
                    まだ投稿がありません
                  </p>
                  <p className="mt-2 text-sm text-[#98A59A]">
                    最初のひとことを投稿してみましょう。
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-3xl border border-[#E8EBE4] bg-white p-1 shadow-[0_8px_30px_rgba(52,79,64,0.05)] transition hover:shadow-[0_12px_35px_rgba(52,79,64,0.09)]"
                    >
                      <Post post={post} onDelete={deletePost} />
                    </div>
                  ))}
                </div>
              )}

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="mt-7 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>
          </section>

          {/* サイドバー */}
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-[#E8EBE4] bg-white shadow-[0_8px_30px_rgba(52,79,64,0.05)]">
              <div className="h-24 bg-gradient-to-r from-[#A6C2AA] via-[#D2E0C7] to-[#E8E9CD]" />

              <div className="-mt-7 px-6 pb-7">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white bg-[#789985] text-2xl text-white shadow-sm">
                  ☘
                </div>

                <SideMenu />
              </div>
            </div>

            {/* メッセージカード */}
            <div className="mt-5 rounded-3xl bg-[#E7EEE5] p-6">
              <p className="mb-2 text-xs font-semibold tracking-widest text-[#58715F]">
                A LITTLE REMINDER
              </p>

              <p className="text-sm leading-7 text-[#738777]">
                小さなつながりが、
                <br />
                毎日を少し豊かにする。
              </p>

              <div className="mt-4 text-right text-2xl">🌼</div>
            </div>
          </aside>
        </div>
      </main>

      {/* フッター */}
      <footer className="mt-12 border-t border-[#E3E8DF] py-7 text-center">
        <p className="text-xs tracking-widest text-[#9BA99D]">
          © 2026 SAGE COMMUNITY · MADE WITH REACT
        </p>
      </footer>
    </div>
  );
}

export default Home;
