'use client';

import { Memo, MemoColor } from '@/types';
import MemoCard from './MemoCard';

interface MemoListProps {
  memos: Memo[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: string, content: string, color: MemoColor, password: string) => Promise<boolean>;
  onDelete: (id: string, password: string) => Promise<boolean>;
}

export default function MemoList({
  memos,
  loading,
  error,
  onUpdate,
  onDelete,
}: MemoListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-yellow-100 rounded-lg shadow-md p-4 animate-pulse"
            style={{ minHeight: '150px' }}
          >
            <div className="h-4 bg-yellow-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-yellow-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-yellow-200 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-600 text-lg">아직 메모가 없습니다.</p>
        <p className="text-gray-500 mt-2">새 메모를 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
