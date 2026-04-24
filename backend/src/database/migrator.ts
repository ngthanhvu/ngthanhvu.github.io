import type { RowDataPacket } from "mysql2";

import { ensureDatabaseExists, pool } from "../config/database.js";
import { migrations } from "./migrations/index.js";
import type { Migration } from "./migrations/types.js";

interface AppliedMigrationRow extends RowDataPacket {
  name: string;
}

const ensureMigrationTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_schema_migrations_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
};

const getAppliedMigrationNames = async (): Promise<Set<string>> => {
  const [rows] = await pool.query<AppliedMigrationRow[]>(
    "SELECT name FROM schema_migrations ORDER BY id ASC;"
  );

  return new Set(rows.map((row) => row.name));
};

export const runPendingMigrations = async (): Promise<void> => {
  await ensureDatabaseExists();
  await ensureMigrationTable();

  const appliedMigrationNames = await getAppliedMigrationNames();
  const pendingMigrations = migrations.filter(
    (migration) => !appliedMigrationNames.has(migration.name)
  );

  if (pendingMigrations.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  for (const migration of pendingMigrations) {
    console.log(`Running migration ${migration.name}`);
    await migration.up(pool);
    await pool.execute("INSERT INTO schema_migrations (name) VALUES (?);", [migration.name]);
  }

  console.log(`Ran ${pendingMigrations.length} migration(s).`);
};

export const rollbackLastMigration = async (): Promise<void> => {
  await ensureDatabaseExists();
  await ensureMigrationTable();

  const [rows] = await pool.query<AppliedMigrationRow[]>(
    "SELECT name FROM schema_migrations ORDER BY id DESC LIMIT 1;"
  );

  const lastAppliedMigration = rows[0];
  if (!lastAppliedMigration) {
    console.log("No migration to roll back.");
    return;
  }

  const migration = [...migrations]
    .reverse()
    .find((candidate: Migration) => candidate.name === lastAppliedMigration.name);

  if (!migration) {
    throw new Error(`Migration file not found for ${lastAppliedMigration.name}`);
  }

  console.log(`Rolling back migration ${migration.name}`);
  await migration.down(pool);
  await pool.execute("DELETE FROM schema_migrations WHERE name = ?;", [migration.name]);
  console.log("Rollback completed.");
};
