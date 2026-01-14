'use client';

import { useState } from 'react';
import { MemoColor } from '@/types';

interface MemoFormProps {
  onSubmit: (content: string, color: MemoColor, password: string) => void;
  onCancel: () => void;
}

const colorClasses: Record<MemoColor, string> = {
  yellow: 'bg-yellow-200 border-yellow-300',
  pink: 'bg-pink-200 border-pink-300',
  blue: 'bg-blue-200 border-blue-300',
  green: 'bg-green-200 border-green-300',
  purple: 'bg-purple-200 border-purple-300',
};

const colors: MemoColor[] = ['yellow', 'pink', 'blue', 'green', 'purple'];

export default function MemoForm({ onSubmit, onCancel }: MemoFormProps) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState<MemoColor>('yellow');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('메모 내용을 입력하세요.');
      return;
    }

    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    onSubmit(content.trim(), color, password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${colorClasses[color]}`}>
        <h2 className="text-lg font-bold mb-4 text-gray-800">새 메모</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/70"
            rows={4}
            maxLength={500}
            placeholder="메모 내용을 입력하세요..."
            autoFocus
          />

          <div className="mt-2 text-right text-sm text-gray-600">
            {content.length}/500
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              색상 선택
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${colorClasses[c]} border-2 ${
                    color === c
                      ? 'ring-2 ring-amber-600 ring-offset-2'
                      : 'border-transparent'
                  } transition`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모 비밀번호 (수정/삭제 시 필요)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/70"
              placeholder="비밀번호 (4자 이상)"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/70"
              placeholder="비밀번호 재입력"
            />
          </div>

          {error && (
            <div className="mt-3 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!content.trim() || !password || !confirmPassword}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed transition"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
