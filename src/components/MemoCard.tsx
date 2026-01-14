'use client';

import { useState } from 'react';
import { Memo, MemoColor } from '@/types';

interface MemoCardProps {
  memo: Memo;
  onUpdate: (id: string, content: string, color: MemoColor, password: string) => Promise<boolean>;
  onDelete: (id: string, password: string) => Promise<boolean>;
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
  const [showPasswordModal, setShowPasswordModal] = useState<'edit' | 'delete' | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditClick = () => {
    setShowPasswordModal('edit');
    setPassword('');
    setError('');
  };

  const handleDeleteClick = () => {
    setShowPasswordModal('delete');
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);
    setError('');

    if (showPasswordModal === 'edit') {
      setIsEditing(true);
      setShowPasswordModal(null);
      setLoading(false);
    } else if (showPasswordModal === 'delete') {
      const success = await onDelete(memo.id, password);
      if (!success) {
        setError('비밀번호가 올바르지 않습니다.');
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const success = await onUpdate(memo.id, content, color, password);
    setLoading(false);

    if (success) {
      setIsEditing(false);
      setPassword('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleCancel = () => {
    setContent(memo.content);
    setColor(memo.color);
    setIsEditing(false);
    setPassword('');
    setError('');
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
          {error && (
            <div className="text-red-600 text-xs">{error}</div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:bg-amber-400"
            >
              {loading ? '저장 중...' : '저장'}
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
            onClick={handleEditClick}
            style={{ fontFamily: 'var(--font-memo, sans-serif)' }}
          >
            {memo.content}
          </div>

          <div className="absolute bottom-2 left-4 right-4 flex justify-between items-center">
            <span className="text-xs text-gray-600">
              {formatDate(memo.updated_at)}
            </span>
            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 text-sm opacity-50 hover:opacity-100 transition"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full mx-4">
            <p className="mb-3 text-gray-800 font-medium text-center">
              {showPasswordModal === 'edit' ? '수정하기' : '삭제하기'}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="비밀번호 입력"
              autoFocus
            />
            {error && (
              <div className="mt-2 text-red-600 text-xs text-center">{error}</div>
            )}
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className={`px-4 py-2 text-white rounded ${
                  showPasswordModal === 'delete'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-amber-600 hover:bg-amber-700'
                } disabled:opacity-50`}
              >
                {loading ? '확인 중...' : '확인'}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(null);
                  setPassword('');
                  setError('');
                }}
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
