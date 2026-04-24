import { pool } from "./config/database.js";
import { rollbackLastMigration, runPendingMigrations } from "./database/migrator.js";

const command = process.argv[2] ?? "up";

try {
  if (command === "up") {
    await runPendingMigrations();
  } else if (command === "down") {
    await rollbackLastMigration();
  } else {
    throw new Error(`Unknown migration command: ${command}`);
  }
} finally {
  await pool.end();
}
