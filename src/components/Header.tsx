'use client';

import { useRouter } from 'next/navigation';
import { clearAuthState } from '@/lib/auth';

interface HeaderProps {
  wallName: string | null;
}

export default function Header({ wallName }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthState();
    router.push('/');
  };

  return (
    <header className="bg-amber-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{wallName || '담벼락'}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition text-sm"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
