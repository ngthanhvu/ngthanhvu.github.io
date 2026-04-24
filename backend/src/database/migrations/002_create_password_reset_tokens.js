export const migration = {
  name: "002_create_password_reset_tokens",
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at DATETIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_reset_user_id (user_id),
        KEY idx_reset_expires_at (expires_at),
        CONSTRAINT fk_reset_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  },
  down: async (pool) => {
    await pool.query("DROP TABLE IF EXISTS password_reset_tokens;");
  }
};
