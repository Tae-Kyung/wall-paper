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
  password_hash VARCHAR(255) NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_memos_wall_id ON memos(wall_id);

-- 4. RLS (Row Level Security) 활성화
ALTER TABLE walls ENABLE ROW LEVEL SECURITY;
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 설정 (INSERT 포함)
DROP POLICY IF EXISTS "Allow all access to walls" ON walls;
DROP POLICY IF EXISTS "Allow all access to memos" ON memos;

CREATE POLICY "Allow all access to walls" ON walls
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to memos" ON memos
  FOR ALL USING (true) WITH CHECK (true);

-- 6. 기본 담벼락 생성 (비밀번호: 1234)
-- 실제 사용 시 아래 INSERT 문의 password_hash를 실제 bcrypt 해시로 변경하세요
INSERT INTO walls (name, password_hash)
VALUES ('담벼락', '$2b$10$/8EdGG1BH0jVbAx0ECCQO.m5FWe/Gffxwyy1HSnaoCjxE0/GPoJH6')
ON CONFLICT DO NOTHING;

-- 기존 테이블에 password_hash 컬럼 추가 (이미 테이블이 있는 경우)
-- ALTER TABLE memos ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
