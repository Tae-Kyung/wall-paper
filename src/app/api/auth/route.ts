import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 기본 담벼락 조회
    const { data: wall, error } = await supabase
      .from('walls')
      .select('*')
      .limit(1)
      .single();

    if (error || !wall) {
      return NextResponse.json(
        { error: '담벼락을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 비밀번호 검증
    const isValid = await bcrypt.compare(password, wall.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      wallId: wall.id,
      wallName: wall.name,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: '인증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
