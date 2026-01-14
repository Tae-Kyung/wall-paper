import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { memoId, password } = await request.json();

    if (!memoId || !password) {
      return NextResponse.json(
        { error: '메모 ID와 비밀번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const { data: memo, error } = await supabase
      .from('memos')
      .select('password_hash')
      .eq('id', memoId)
      .single();

    if (error || !memo) {
      return NextResponse.json(
        { error: '메모를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, memo.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: '검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
