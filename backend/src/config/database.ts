import mysql from "mysql2/promise";

import { env } from "./env.js";

export const pool = mysql.createPool(env.mysql);

const escapeIdentifier = (value: string): string => `\`${value.replace(/`/g, "``")}\``;

export const ensureDatabaseExists = async (): Promise<void> => {
  const bootstrapConnection = await mysql.createConnection({
    host: env.mysql.host,
    port: env.mysql.port,
    user: env.mysql.user,
    password: env.mysql.password
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(
      env.mysql.database
    )} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await bootstrapConnection.end();
};

export const verifyDatabaseConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};
