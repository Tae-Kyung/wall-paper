export interface Wall {
  id: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Memo {
  id: string;
  wall_id: string;
  content: string;
  color: MemoColor;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type MemoColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple';

export interface CreateMemoInput {
  wall_id: string;
  content: string;
  color?: MemoColor;
}

export interface UpdateMemoInput {
  content?: string;
  color?: MemoColor;
  is_pinned?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  wallId: string | null;
  wallName: string | null;
}
