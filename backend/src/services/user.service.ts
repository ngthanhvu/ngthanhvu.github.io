import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database.js";
import { CreateUserInput, User } from "../models/user.model.js";

type UserRow = RowDataPacket & {
  id: number;
  email: string;
  full_name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

const mapUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  passwordHash: row.password_hash,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const userService = {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] ? mapUser(rows[0]) : null;
  },

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ? mapUser(rows[0]) : null;
  },

  async create(input: CreateUserInput): Promise<User> {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (email, full_name, password_hash) VALUES (?, ?, ?)",
      [input.email, input.fullName, input.passwordHash]
    );

    const user = await this.findById(result.insertId);

    if (!user) {
      throw new Error("Cannot load created user");
    }

    return user;
  },

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await pool.execute("UPDATE users SET password_hash = ? WHERE id = ?", [
      passwordHash,
      userId
    ]);
  }
};
