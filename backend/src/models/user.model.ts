import pool from '../config/database';
import { User } from '../types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class UserModel {
  static async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [countRows] = await pool.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM users');
    return { users: rows as User[], total: countRows[0].total };
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length ? (rows[0] as User) : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length ? (rows[0] as User) : null;
  }

  static async create(data: Partial<User>): Promise<User> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [data.name, data.email, data.password, data.role || 'user']
    );
    return this.findById(result.insertId) as Promise<User>;
  }

  static async update(id: number, data: Partial<User>): Promise<User | null> {
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];
    await pool.execute(`UPDATE users SET ${fields}, updated_at = NOW() WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
