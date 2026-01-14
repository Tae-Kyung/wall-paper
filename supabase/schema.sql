-- 담벼락 메모 앱 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. walls 테이블 (담벼락)
CREATE TABLE IF NOT EXISTS walls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. memos 테이블 (메모)
CREATE TABLE IF NOT EXISTS memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wall_id UUID NOT NULL REFERENCES walls(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  color VARCHAR(20) DEFAULT 'yellow',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_memos_wall_id ON memos(wall_id);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE walls ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 설정 (모든 접근 허용 - 앱 레벨에서 인증 처리)
CREATE POLICY "Allow all access to walls" ON walls FOR ALL USING (true);
CREATE POLICY "Allow all access to memos" ON memos FOR ALL USING (true);

-- 6. 기본 담벼락 생성 (비밀번호: 1234)
-- bcrypt 해시값: $2b$10$rQZ8K1X5K5Y5Y5Y5Y5Y5YuE8K1X5K5Y5Y5Y5Y5Y5YuE8K1X5K5Y5Y
-- 실제 사용 시 아래 INSERT 문의 password_hash를 실제 bcrypt 해시로 변경하세요
INSERT INTO walls (name, password_hash)
VALUES ('기본 담벼락', '$2b$10$EIXe0G5J5H5H5H5H5H5H5uQZwZwZwZwZwZwZwZwZwQZwZwZwZwZwZ')
ON CONFLICT DO NOTHING;

-- 참고: Node.js에서 bcrypt 해시 생성하기
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('1234', 10);
-- console.log(hash);
