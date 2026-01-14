'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState } from '@/lib/auth';
import { useMemos } from '@/hooks/useMemos';
import { MemoColor } from '@/types';
import Header from '@/components/Header';
import MemoList from '@/components/MemoList';
import MemoForm from '@/components/MemoForm';

export default function WallPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    wallId: null as string | null,
    wallName: null as string | null,
  });

  const { memos, loading, error, createMemo, updateMemo, deleteMemo } = useMemos(
    authState.wallId
  );

  useEffect(() => {
    setMounted(true);
    const state = getAuthState();
    setAuthState(state);

    if (!state.isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  const handleCreateMemo = async (content: string, color: MemoColor) => {
    if (!authState.wallId) return;

    const success = await createMemo({
      wall_id: authState.wallId,
      content,
      color,
    });

    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateMemo = async (id: string, content: string, color: MemoColor) => {
    await updateMemo(id, { content, color });
  };

  const handleDeleteMemo = async (id: string) => {
    await deleteMemo(id);
  };

  if (!mounted || !authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">
        <div className="text-amber-800">로딩 중...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#D4A574',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c49a6c' fill-opacity='0.3'%3E%3Ccircle cx='25' cy='25' r='2'/%3E%3Ccircle cx='75' cy='75' r='2'/%3E%3Ccircle cx='75' cy='25' r='1'/%3E%3Ccircle cx='25' cy='75' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Header wallName={authState.wallName} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-amber-900">
            메모 ({memos.length}개)
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md"
          >
            <span className="text-xl">+</span>
            <span>새 메모</span>
          </button>
        </div>

        <MemoList
          memos={memos}
          loading={loading}
          error={error}
          onUpdate={handleUpdateMemo}
          onDelete={handleDeleteMemo}
        />
      </main>

      {showForm && (
        <MemoForm
          onSubmit={handleCreateMemo}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
