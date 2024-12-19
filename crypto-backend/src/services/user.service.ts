import pool from '../config/database';
import { User } from '../models/user.model';

export const getUsers = async (): Promise<User[]> => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const createUser = async (user: User): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
    [user.username, user.password_hash, user.role]
  );
  return result.rows[0];
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User | null> => {
  const result = await pool.query(
    'UPDATE users SET username = $1, password_hash = $2, role = $3 WHERE id = $4 RETURNING *',
    [user.username, user.password_hash, user.role, id]
  );
  return result.rows[0] || null;
};

export const deleteUser = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
};