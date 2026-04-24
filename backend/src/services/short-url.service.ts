import { randomBytes } from "crypto";
import { ResultSetHeader, RowDataPacket } from "mysql2";

import { pool } from "../config/database.js";
import { CreateShortUrlInput, ShortUrl } from "../models/short-url.model.js";
import { HttpError } from "./auth.service.js";

type ShortUrlRow = RowDataPacket & {
  id: number;
  code: string;
  original_url: string;
  access_count: number;
  created_at: Date;
  updated_at: Date;
  last_accessed_at: Date | null;
};

const mapShortUrl = (row: ShortUrlRow): ShortUrl => ({
  id: row.id,
  code: row.code,
  originalUrl: row.original_url,
  accessCount: row.access_count,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastAccessedAt: row.last_accessed_at
});

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateCode = (): string => {
  const bytes = randomBytes(7);

  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
};

const normalizeUrl = (value: string): string => {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported protocol");
    }

    return url.toString();
  } catch {
    throw new HttpError(400, "URL không hợp lệ");
  }
};

const isDuplicateEntryError = (error: unknown): boolean =>
  error instanceof Error && "code" in error && error.code === "ER_DUP_ENTRY";

const normalizeCustomCode = (value: string): string => {
  const code = value.trim();

  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(code)) {
    throw new HttpError(400, "Mã tuỳ chỉnh phải dài 3-32 ký tự và chỉ gồm chữ, số, gạch ngang hoặc gạch dưới");
  }

  return code;
};

export const shortUrlService = {
  async list(): Promise<ShortUrl[]> {
    const [rows] = await pool.query<ShortUrlRow[]>(
      "SELECT * FROM short_urls ORDER BY created_at DESC, id DESC LIMIT 100"
    );

    return rows.map(mapShortUrl);
  },

  async findByCode(code: string): Promise<ShortUrl | null> {
    const [rows] = await pool.query<ShortUrlRow[]>(
      "SELECT * FROM short_urls WHERE code = ? LIMIT 1",
      [code]
    );

    return rows[0] ? mapShortUrl(rows[0]) : null;
  },

  async create(originalUrl: string, customCode?: string): Promise<ShortUrl> {
    const normalizedUrl = normalizeUrl(originalUrl);

    if (customCode?.trim()) {
      try {
        return await this.createWithCode({
          code: normalizeCustomCode(customCode),
          originalUrl: normalizedUrl
        });
      } catch (error) {
        if (isDuplicateEntryError(error)) {
          throw new HttpError(409, "Mã tuỳ chỉnh đã tồn tại");
        }

        throw error;
      }
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = generateCode();

      try {
        return await this.createWithCode({
          code,
          originalUrl: normalizedUrl
        });
      } catch (error) {
        if (isDuplicateEntryError(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Cannot generate a unique short URL code");
  },

  async createWithCode(input: CreateShortUrlInput): Promise<ShortUrl> {
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO short_urls (code, original_url) VALUES (?, ?)",
      [input.code, input.originalUrl]
    );

    const shortUrl = await this.findById(result.insertId);

    if (!shortUrl) {
      throw new Error("Cannot load created short URL");
    }

    return shortUrl;
  },

  async findById(id: number): Promise<ShortUrl | null> {
    const [rows] = await pool.query<ShortUrlRow[]>(
      "SELECT * FROM short_urls WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ? mapShortUrl(rows[0]) : null;
  },

  async recordVisit(
    shortUrlId: number,
    metadata: { ipAddress?: string; userAgent?: string; referrer?: string }
  ): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.execute(
        `INSERT INTO short_url_visits (short_url_id, ip_address, user_agent, referrer)
         VALUES (?, ?, ?, ?)`,
        [
          shortUrlId,
          metadata.ipAddress?.slice(0, 45) ?? null,
          metadata.userAgent?.slice(0, 512) ?? null,
          metadata.referrer?.slice(0, 512) ?? null
        ]
      );
      await connection.execute(
        `UPDATE short_urls
         SET access_count = access_count + 1, last_accessed_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [shortUrlId]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};
