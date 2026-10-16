import { useEffect, useState } from 'react';
import { SessionContext } from './SessionContext.js';
import { authRepository } from './repositories/auth.js';

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      try {
        const user = await authRepository.getCurrentUser();

        if (!ignore) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('ログイン情報の復元に失敗しました。', error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <p role="status">ログイン情報を確認中です…</p>;
  }

  return (
    <SessionContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </SessionContext.Provider>
  );
}