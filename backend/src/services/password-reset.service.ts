import crypto from "node:crypto";

import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database.js";
import { env } from "../config/env.js";

type PasswordResetTokenRow = RowDataPacket & {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
};

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const passwordResetService = {
  async create(userId: number): Promise<{ token: string; expiresAt: Date }> {
    await pool.execute(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
      [userId]
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + env.resetTokenExpiresMinutes * 60 * 1000);

    await pool.execute<ResultSetHeader>(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, hashToken(token), expiresAt]
    );

    return { token, expiresAt };
  },

  async consume(token: string): Promise<{ userId: number } | null> {
    const [rows] = await pool.query<PasswordResetTokenRow[]>(
      `
        SELECT *
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1
      `,
      [hashToken(token)]
    );

    const resetToken = rows[0];

    if (!resetToken) {
      return null;
    }

    await pool.execute("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [
      resetToken.id
    ]);

    return { userId: resetToken.user_id };
  }
};
