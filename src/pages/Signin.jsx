import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router';
import { authRepository } from '../repositories/auth.js';
import { SessionContext } from '../SessionContext.js';

function Signin() {
  const { currentUser, setCurrentUser } = useContext(SessionContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const signin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const user = await authRepository.signin(email.trim(), password);

      setCurrentUser(user);
      setSuccessMessage(
        `${user.userName || 'ユーザー'}さん、ログインできました！`
      );
      setPassword('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'ログインに失敗しました。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          SNS APP
        </h2>

        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={signin} className="space-y-6">
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
                    type="email"
                    autoComplete="username"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

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
                    type="password"
                    autoComplete="current-password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {errorMessage && (
                <p role="alert" className="text-sm text-red-600">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p role="status" className="text-sm text-green-700">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={!email.trim() || !password || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'ログイン中…' : 'ログイン'}
              </button>

              <div className="mt-4 text-center text-sm">
                登録は
                <Link className="underline" to="/signup">
                  こちら
                </Link>
                から
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;