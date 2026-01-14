'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Memo, CreateMemoInput, UpdateMemoInput } from '@/types';

export function useMemos(wallId: string | null) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemos = useCallback(async () => {
    if (!wallId) {
      setMemos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('wall_id', wallId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('메모를 불러오는데 실패했습니다.');
      console.error('Fetch memos error:', fetchError);
    } else {
      setMemos(data || []);
    }

    setLoading(false);
  }, [wallId]);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  const createMemo = async (input: CreateMemoInput): Promise<boolean> => {
    try {
      const response = await fetch('/api/memos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '메모 생성에 실패했습니다.');
        return false;
      }

      setMemos((prev) => [data.memo, ...prev]);
      return true;
    } catch (err) {
      console.error('Create memo error:', err);
      setError('메모 생성에 실패했습니다.');
      return false;
    }
  };

  const verifyPassword = async (memoId: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/memos/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoId, password }),
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  const updateMemo = async (
    id: string,
    input: UpdateMemoInput,
    password: string
  ): Promise<boolean> => {
    // 먼저 비밀번호 검증
    const isValid = await verifyPassword(id, password);
    if (!isValid) {
      return false;
    }

    const { data, error: updateError } = await supabase
      .from('memos')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      setError('메모 수정에 실패했습니다.');
      console.error('Update memo error:', updateError);
      return false;
    }

    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? data : memo))
    );
    return true;
  };

  const deleteMemo = async (id: string, password: string): Promise<boolean> => {
    // 먼저 비밀번호 검증
    const isValid = await verifyPassword(id, password);
    if (!isValid) {
      return false;
    }

    const { error: deleteError } = await supabase
      .from('memos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError('메모 삭제에 실패했습니다.');
      console.error('Delete memo error:', deleteError);
      return false;
    }

    setMemos((prev) => prev.filter((memo) => memo.id !== id));
    return true;
  };

  return {
    memos,
    loading,
    error,
    createMemo,
    updateMemo,
    deleteMemo,
    refetch: fetchMemos,
  };
}
