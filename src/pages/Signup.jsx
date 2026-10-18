import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { SessionContext } from '../SessionContext.js';
import { authRepository } from '../repositories/auth.js';

function Signup() {
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(SessionContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signup = async () => {
    if (isSubmitting) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // 新規登録して、ユーザーとセッションを取得
      const { user, session } = await authRepository.signup(
        name,
        email,
        password,
      );

      if (session) {
        // Reactのログイン情報を更新
        setCurrentUser(user);

        // 投稿画面へ移動
        navigate('/', { replace: true });
      } else {
        // メール認証が必要な場合
        setSuccessMessage('登録を受け付けました。確認メールをご確認ください。');
      }
    } catch (error) {
      console.error('登録エラー:', error);

      setErrorMessage(
        error instanceof Error ? error.message : 'ユーザー登録に失敗しました。',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">SNS APP</h2>

        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* ユーザー名 */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  ユーザー名
                </label>

                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ユーザー名"
                    required
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  メールアドレス
                </label>

                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    required
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  パスワード
                </label>

                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    required
                    type="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* 登録ボタン */}
              <div>
                <button
                  type="button"
                  onClick={signup}
                  disabled={
                    !name.trim() || !email.trim() || !password || isSubmitting
                  }
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '登録中...' : '登録'}
                </button>
              </div>

              {/* エラーメッセージ */}
              {errorMessage && (
                <p role="alert" className="text-sm text-red-600">
                  {errorMessage}
                </p>
              )}

              {/* 登録成功メッセージ */}
              {successMessage && (
                <p role="status" className="text-sm text-green-600">
                  {successMessage}
                </p>
              )}

              {/* ログイン画面へのリンク */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  すでにアカウントをお持ちの方はこちら
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
