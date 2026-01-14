import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { wall_id, content, color, password } = await request.json();

    if (!wall_id || !content || !password) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 4자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('memos')
      .insert([{
        wall_id,
        content,
        color: color || 'yellow',
        password_hash: passwordHash,
      }])
      .select()
      .single();

    if (error) {
      console.error('Create memo error:', error);
      return NextResponse.json(
        { error: '메모 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, memo: data });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: '메모 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
