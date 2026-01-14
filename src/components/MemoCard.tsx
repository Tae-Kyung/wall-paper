'use client';

import { useState } from 'react';
import { Memo, MemoColor } from '@/types';

interface MemoCardProps {
  memo: Memo;
  onUpdate: (id: string, content: string, color: MemoColor) => void;
  onDelete: (id: string) => void;
}

const colorClasses: Record<MemoColor, string> = {
  yellow: 'bg-yellow-200 border-yellow-300',
  pink: 'bg-pink-200 border-pink-300',
  blue: 'bg-blue-200 border-blue-300',
  green: 'bg-green-200 border-green-300',
  purple: 'bg-purple-200 border-purple-300',
};

const colors: MemoColor[] = ['yellow', 'pink', 'blue', 'green', 'purple'];

export default function MemoCard({ memo, onUpdate, onDelete }: MemoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(memo.content);
  const [color, setColor] = useState<MemoColor>(memo.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    if (content.trim()) {
      onUpdate(memo.id, content, color);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setContent(memo.content);
    setColor(memo.color);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(memo.id);
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`relative p-4 rounded-lg shadow-md border-2 ${colorClasses[color]} transition-all hover:shadow-lg`}
      style={{
        transform: 'rotate(-1deg)',
        minHeight: '150px',
      }}
    >
      {/* 포스트잇 접힌 모서리 효과 */}
      <div
        className="absolute top-0 right-0 w-0 h-0"
        style={{
          borderStyle: 'solid',
          borderWidth: '0 20px 20px 0',
          borderColor: `transparent rgba(0,0,0,0.1) transparent transparent`,
        }}
      />

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/50"
            rows={4}
            maxLength={500}
            autoFocus
          />
          <div className="flex gap-1">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full ${colorClasses[c]} ${
                  color === c ? 'ring-2 ring-amber-600 ring-offset-1' : ''
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            className="whitespace-pre-wrap break-words cursor-pointer mb-4 min-h-[60px]"
            onClick={() => setIsEditing(true)}
            style={{ fontFamily: 'var(--font-memo, sans-serif)' }}
          >
            {memo.content}
          </div>

          <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {formatDate(memo.updated_at)}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 hover:text-red-700 text-sm opacity-50 hover:opacity-100 transition"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-gray-800">삭제하시겠습니까?</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
