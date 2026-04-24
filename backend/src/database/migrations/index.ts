import { migration as createUsers } from "./001_create_users.js";
import { migration as createPasswordResetTokens } from "./002_create_password_reset_tokens.js";
import { migration as createShortUrls } from "./003_create_short_urls.js";
import type { Migration } from "./types.js";

export const migrations: Migration[] = [createUsers, createPasswordResetTokens, createShortUrls];
