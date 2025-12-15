// types/index.ts
export interface User {
  id: number;
  email: string;
  username: string;
  image: string | null;
  thumbnail_small: string | null;
  thumbnail_medium: string | null;
  last_seen: string | null;
}

export interface File {
  id: number;
  file_url: string;
  file_type?: string;
  original_name?: string;
}

export interface Message {
  id: number;
  value: string;
  date: string;
  user: number;
  viewers: number[];
  liked: number;
  files: File[];
  is_own: boolean;
}

export interface Chat {
  id: number;
  name: string | null;
  users: User[];
  room_type: 'D' | 'G';
  image: string | null;
  last_message: Message | null;
  unread_count: number;
}
