import { useContext } from 'react';
import { SessionContext } from '../SessionContext.js';

export function SideMenu() {
  const { currentUser } = useContext(SessionContext);

  if (!currentUser) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        プロフィール
      </h2>

      <p>
        <strong>名前：</strong>
        {currentUser.userName || '未設定'}
      </p>

      <p className="mt-2 break-all">
        <strong>メール：</strong>
        {currentUser.email}
      </p>
    </div>
  );
}