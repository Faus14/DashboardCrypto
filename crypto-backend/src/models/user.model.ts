export interface User {
  id?: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'user';
}