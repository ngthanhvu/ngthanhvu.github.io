export const migration = {
  name: "003_create_short_urls",
  up: async (pool) => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_urls (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        code VARCHAR(32) NOT NULL,
        original_url TEXT NOT NULL,
        access_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_accessed_at TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uniq_short_urls_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_url_visits (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        short_url_id BIGINT UNSIGNED NOT NULL,
        ip_address VARCHAR(45) NULL,
        user_agent VARCHAR(512) NULL,
        referrer VARCHAR(512) NULL,
        visited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_short_url_visits_short_url_id (short_url_id),
        CONSTRAINT fk_short_url_visits_short_url_id
          FOREIGN KEY (short_url_id) REFERENCES short_urls(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  },
  down: async (pool) => {
    await pool.query("DROP TABLE IF EXISTS short_url_visits;");
    await pool.query("DROP TABLE IF EXISTS short_urls;");
  }
};
