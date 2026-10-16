import { useContext, useState } from 'react';
import { Navigate } from 'react-router';
import { SessionContext } from '../SessionContext.js';
import { SideMenu } from '../components/SideMenu.jsx';
import { authRepository } from '../repositories/auth.js';
import { postRepository } from '../repositories/post.js';

function Home() {
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const [content, setContent] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createPost = async () => {
    if (!content.trim() || !currentUser) return;

    setErrorMessage('');

    try {
      const post = await postRepository.create(
        content.trim(),
        currentUser.id
      );

      console.log(post);
      setContent('');
    } catch (error) {
      setErrorMessage(error.message || '投稿に失敗しました。');
    }
  };

  const signout = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setErrorMessage('');

    try {
      await authRepository.signout();
      setCurrentUser(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'ログアウトに失敗しました。'
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#34D399] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            SNS APP
          </h1>

          <button
            type="button"
            onClick={signout}
            disabled={isSigningOut}
            className="text-white hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? 'ログアウト中…' : 'ログアウト'}
          </button>
        </div>
      </header>

      <div className="container mx-auto mt-6 p-4">
        {errorMessage && (
          <p role="alert" className="mb-4 text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <button
                type="button"
                onClick={createPost}
                disabled={!content.trim()}
                className="bg-[#34D399] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>

            <div className="mt-4"></div>
          </div>

          <div>
            <SideMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;